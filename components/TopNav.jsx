import React from 'react'

export default function TopNav({isViewer, toggleViewer, showNav, setShowNav, savingNote, handleSaveNote }) {
    return (
    <>
        <div className="notes-btn">
            <button onClick={()=> setShowNav(!showNav)} className="menu card-button-primary">
                <i className="fa-solid fa-bars"></i>
            </button>
            <button onClick={handleSaveNote} disabled={savingNote} className="card-button-secondary">
                <h6>{savingNote?"Saving...":"Save"}</h6>
                <i className="fa-solid fa-floppy-disk"></i>
            </button>
            <button onClick={()=>{toggleViewer(!isViewer)}}className="card-button-secondary">
            {
                isViewer ? 
                ( 
                    <>
                        <h6>Editor</h6>
                        <i className="fa-solid fa-pencil"></i>
                    </>
                            
                ) 
                            
                :

                (
                    <>
                        <h6>Viewer</h6>
                        <i className="fa-solid fa-check-double"></i>
                    </>
                )
            }
            </button>
        </div>
        <div className='full-line'></div>
    </>
    )
}
