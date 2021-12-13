import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState =(props)=>{
    const notesInitial =[
        {
          "_id": "6177f745331e5eb224edad52",
          "user": "6177d13eaa401f63bdf9c554",
          "title": "My Title",
          "description": "Hello Everyone",
          "tag": "personal",
          "data": "2021-10-26T12:40:37.140Z",
          "__v": 0
        },
        {
          "_id": "6178ff090160186ee752cd20",
          "user": "6177d13eaa401f63bdf9c554",
          "title": "First Api",
          "description": "Hello",
          "tag": "personal",
          "data": "2021-10-27T07:26:01.269Z",
          "__v": 0
        }
      ]
   const [notes,setNotes]= useState(notesInitial)
    return(
        <NoteContext.Provider value={{notes,setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )

}
export default NoteState;