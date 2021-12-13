import React from 'react'

const NoteItem = (props) => {
    const { note } = props;
    return (
        <div className="col-md-3">
            <div class="card" >
                <div class="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{note.description}</h6>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
