import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { supabase } from './supabaseClient'

const mediaTypes = ['image', 'video', 'music']

export default function Editor() {
  const [layout, setLayout] = useState([])
  const [savedContentId, setSavedContentId] = useState(null)

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.droppableId !== 'canvas') return
    const type = mediaTypes[result.source.index]
    const newItem = { id: Date.now().toString(), type }
    setLayout(prev => [...prev, newItem])
  }

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Not logged in')

    const { data, error } = await supabase
      .from('content')
      .insert({ user_id: user.id, layout_json: layout })
      .select()

    if (error) alert('Save failed')
    else {
      setSavedContentId(data[0].id)
      alert('Saved!')
    }
  }

  const addSchedule = async () => {
    if (!savedContentId) return alert('Save layout first')

    const day = document.getElementById('day').value
    const start = document.getElementById('start').value
    const end = document.getElementById('end').value

    if (!day || !start || !end) return alert('Fill all fields')

    const { error } = await supabase
      .from('schedules')
      .insert({ content_id: savedContentId, day, start_time: start, end_time: end })

    error ? alert('Schedule failed') : alert('Scheduled!')
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 20, padding: 20 }}>
        {/* Sidebar */}
        <Droppable droppableId="sidebar">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: 200 }}>
              <h3>Media</h3>
              {mediaTypes.map((item, i) => (
                <Draggable key={item} draggableId={item} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: 12, margin: 5, background: '#eee', borderRadius: 6,
                        ...provided.draggableProps.style
                      }}
                    >
                      Add {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Canvas & Controls */}
        <div style={{ flex: 1 }}>
          <h2>Canvas</h2>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ minHeight: 400, border: '2px dashed #ccc', borderRadius: 8, padding: 10 }}
              >
                {layout.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'inline-block', padding: 20, margin: 8,
                      background: '#f0f8ff', border: '1px solid #007bff', borderRadius: 6
                    }}
                  >
                    {item.type.toUpperCase()}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <button onClick={handleSave} style={{ marginTop: 15, padding: '10px 20px', fontSize: 16 }}>
            Save Layout
          </button>

          {/* Schedule Form */}
          {savedContentId && (
            <div style={{ marginTop: 25, padding: 15, background: '#f9f9f9', borderRadius: 8 }}>
              <h3>Schedule Content</h3>
              <select id="day" style={{ marginRight: 10 }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input type="time" id="start" style={{ marginRight: 10 }} />
              <input type="time" id="end" style={{ marginRight: 10 }} />
              <button onClick={addSchedule}>Add Schedule</button>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  )
}