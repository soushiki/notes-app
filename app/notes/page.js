'use client'
import Editor from "@/components/Editor";
import MDX from "@/components/MDX";
import SideNav from "@/components/SideNav";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage(){
    //useStates
    const [isViewer, setIsViewer] = useState(true);
    const [text, setText] = useState('');
    const [showNav, setShowNav] = useState(false);
    const [note, setNote] = useState({
        content: '',
        id: ''
    });
    const [savingNote, setSavingNote] = useState(false);  
    const [noteIds, setNoteIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isArchived, setIsArchived] = useState(false);

    const { currentUser, isLoadingUser } = useAuth();
     
    const searchParams = useSearchParams();

    function handleCreateNote(){
        setNote( {
            content: '',
            archive: false
        });
        window.history.replaceState(null, '', '/notes');
        setIsViewer(false);
    }

    function handleEditNote(e){
        setNote({
            ...note,
            content:  e.target.value
        })

    }
    
 
    async function handleSaveNote(){

       

        if(!note?.content){
            return
        }

        setSavingNote(true);

        try{
            

                if(note.id){
                    const noteRef = doc(db, 'users', currentUser.uid, 'notes', note.id);
                    await setDoc(noteRef, {
                         ...note
                    }, {
                        merge: true
                    });
                }
                else {

                    
                    const newId = note.content.replaceAll('#', '').slice(0,15) + '__' + Date.now();
                    console.log(newId);
                    const notesRef = doc(db, 'users', currentUser.uid, 'notes', newId);
                    const newDocInfo = await setDoc(notesRef, {
                        id: newId,
                        content: note.content,
                        createdAt: serverTimestamp(),
                        archive: false
                    });
                    const newNote = {id: newId, archive: false};
                    console.log(noteIds);
                    setNoteIds(curr => [...curr, {id: newId, archive: false}])
                    setNote({...note, id: newId });
                    window.history.pushState(null, '', `?id=${newId}`);
                }

        }
        catch(err){

            console.log(err.message);

        }
        finally{
            setSavingNote(false);

        }

    }

    useEffect(()=>{
        const value = searchParams.get('id');
        
        if(!value || !currentUser) {
            return;
        }

        async function fetchNote(){

            if(isLoading) return;

            try{
                setIsLoading(true);
                const noteRef = doc(db, 'users', currentUser.uid, 'notes', value);
                const snapshot = await getDoc(noteRef);
                const docData = snapshot.exists() ?  {id: snapshot.id, ...snapshot.data() } : null;
                if (docData){
                    setNote({...docData});
                }

            }
            catch(err){
                console.log(err.message);
            }
            finally{
                setIsLoading(false);
            }

        }
        fetchNote();
    }, [currentUser, searchParams]);

      if(isLoadingUser){
        return (<h6 className="text-gradient">Loading...</h6>)
      }
      if(!currentUser){
        
        window.location.href = '/'
      }

    
    
    
    return (
        <main id="notes">
            
            <SideNav setNote={setNote} setIsViewer={setIsViewer} handleCreateNote={handleCreateNote} noteIds={noteIds} setNoteIds={setNoteIds} showNav={showNav} setShowNav={setShowNav} setIsArchived={setIsArchived} isArchived={isArchived}/> 
            
            { !isViewer 
                &&  (
                <Editor savingNote = {savingNote} handleSaveNote={handleSaveNote} text={note.content} setText={handleEditNote} isViewer={isViewer} toggleViewer={setIsViewer} showNav={showNav} setShowNav={setShowNav}/>
            )}
            { isViewer && (
                <MDX  savingNote = {savingNote} handleSaveNote={handleSaveNote} text={note.content} setText={setText} isViewer={isViewer} toggleViewer={setIsViewer}  showNav={showNav} setShowNav={setShowNav} setNoteIds={setNoteIds}/>
            )}
        </main>
    );
}