import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react'

export default function SideNav(props) {
    
    const {setNote, showNav, setShowNav, noteIds, setNoteIds, handleCreateNote, setIsViewer, setIsArchived, isArchived} = props;
    const { logout, currentUser } = useAuth();

    const searchParams = useSearchParams();
    const ref = useRef();
    const router = useRouter();


    async function toggleArchiveNote(noteId, archiveStatus){
        try{

            const noteRef = doc(db, 'users', currentUser.uid, 'notes', noteId);
          
            
            await updateDoc(noteRef, {
                archive: !archiveStatus
            });

            setNoteIds((current) => {

                return current.map(element => {if(element['id'] === noteId){
                    element['archived'] = !archiveStatus;
                } return element;
            }
                
            )
                
            })
        
        }
        catch(err){
            console.log(err.message)
        }
        finally{

        }
    }

    

    


    async function deleteNote(noteId) {
       
        const value = searchParams.get('id');
       
       
        try {

            const noteRef = doc(db, 'users', currentUser.uid, 'notes', noteId);
            await deleteDoc(noteRef);
            setNoteIds((current) => {

                return current.filter(element => element['id'] !== noteId);
                
            })
        }
        catch (err){
            console.log(err.message);
        }
        finally {
            if(value === noteId){
                router.push('/notes');
                setNote({id:'', archived: false});
            }

        }
    }

    useEffect(() => {
        function handleClickOutside(event){
            if(ref.current && !ref.current.contains(event.target)){
                    setShowNav(false);
            }


        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[ref]);

    useEffect(() => {
        if(!currentUser){
            return;
        }

        async function fetchIndexes(){
            
            try{
                const notesRef = collection(db, 'users', currentUser.uid, 'notes');
                const snapshot = await getDocs(notesRef);
                const notesIndexes = snapshot.docs.map((doc)=>{
                    
                  return {id:doc.id, archived: doc.data().archive  }}
                );
                

                setNoteIds(notesIndexes);
               
            } catch (err){
                console.log(err.message);

            } finally{

            }
        }

        fetchIndexes();
        
    }, []);
  return (
    <section ref={ref} className={"nav " + ( showNav ? "" : "hidden-nav")}>
        <h1 className='text-gradient'>Da Vinci Diary</h1>
        <h6>Easy But Inventive Notetaking</h6>
        <div className='full-line'></div>
        <div className='button-container'>
            <button className='new-btn' onClick={handleCreateNote}>
                <h6>New Note</h6>
                <i className='fa-solid fa-plus'></i>
            </button>
            <button onClick={()=>{setIsArchived(false)}} className='all-btn'>
                <h6 >All</h6>
            </button>
        <button>
            <h6 onClick={()=>{setIsArchived(true)}} className='archived-btn'>Archived</h6>
            
        </button>
        </div>
        <div  className='notes-list'>
                {
                     (!isArchived && noteIds.filter(e=>!e['archived']).length===0 ) ?
                            
                                <h6 className='message'>You don't have any notes</h6> :
                                null
                            
                 } {(isArchived && noteIds.filter(e=>e['archived']).length===0 ) ?
                           
                                <h6 className='message' >You don't have any archived notes</h6>
                            : null
                 }
                
                { 
                     
                    noteIds.length == 0 ?
                    <p>You don't have any notes</p> :
                    noteIds.map((note, i)=>{

                        
                        
                        
                        if(isArchived && note['archived']){
                            const [n, d]= note['id'].split('__');
                            const date = (new Date(parseInt(d))).toString();
                           
                            return (
                            <button onClick={()=> {
                                router.push('/notes?id=' + note['id']);
                                setIsViewer(true);
                            }} key={i} className='card-button-secondary list-btn'>
                                <p>{n}</p> 
                                <small>{date.split(' ').slice(1, 4).join(' ')}</small>
                                
                                 <div className="note-actions">
                                    <div className='archive-btn' onClick={(e)=>{
                                    e.stopPropagation(); 
                                    toggleArchiveNote(note['id'], note['archived']);
                                    
                                    }} >
                                    <i className="fa-solid fa-folder"></i>
                                    </div>
                                    <div onClick={(e)=>{
                                        e.stopPropagation(); 
                                        deleteNote(note['id']);
                                        }} className='delete-btn'>
                                        <i className='fa-solid fa-trash-can'>
                                        </i>
                                     </div>
                                 </div>
                            </button> 
                        )
                        } else if( !isArchived && !note['archived']){
                            
                            const [n, d]= note['id'].split('__');
                           
                        const date = (new Date(parseInt(d))).toString();
                             return (
                            <button onClick={()=> {
                                router.push('/notes?id=' + note['id']);
                                setIsViewer(true);
                            }} key={i} className='card-button-secondary list-btn'>
                                <p>{n}</p> 
                                <small>{date.split(' ').slice(1, 4).join(' ')}</small>
                                
                                 <div className="note-actions">
                                    <div className='archive-btn' onClick={(e)=>{
                                    e.stopPropagation(); 
                                    toggleArchiveNote(note['id'], note['archived']);
                                    
                                    }} >
                                    <i className="fa-solid fa-folder"></i>
                                    </div>
                                    <div onClick={(e)=>{
                                        e.stopPropagation(); 
                                        deleteNote(note['id']);
                                        }} className='delete-btn'>
                                        <i className='fa-solid fa-trash-can'>
                                        </i>
                                     </div>
                                 </div>
                            </button> 
                             )
                        } 
                       
                        
                    })       
                }
            
        </div>
        <div className='full-line'></div>
        <button onClick={logout}>
            <h6>Logout</h6>
            <i className='fa-solid fa-arrow-right-from-bracket'></i>
        </button>
    </section>
  )
}
