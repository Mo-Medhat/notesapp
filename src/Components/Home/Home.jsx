import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

export default function Home() {
  const [allNotes, setAllNotes] = useState([]);

  let token = localStorage.getItem("token");
  if (token) {
    var decode = jwtDecode(localStorage.getItem("token"));
  }

  const [newNotes, setNewNotes] = useState({
    title: "",
    desc: "",
    userID: decode._id,
    token,
  });

  async function getAllNote() {
    let { data } = await axios.get(
      `https://route-egypt-api.herokuapp.com/getUserNotes`,
      {
        headers: {
          token,
          userID: decode._id,
        },
      }
    );
    setAllNotes(data.Notes);
  }

  useEffect(() => {
    getAllNote();
  }, []);

  function getNotes(e) {
    let inputValue = e.target.value;
    let nNewNotes = { ...newNotes };
    nNewNotes[e.target.id] = inputValue;
    setNewNotes(nNewNotes);
  }

  function createNote() {
    $(".animateLayer").show();
  }
  function closeNote() {
    $(".animateLayer").hide();
  }

  async function submitNote(e) {
    e.preventDefault();
    let { data } = await axios.post(
      "https://route-egypt-api.herokuapp.com/addNote",
      newNotes
    );
    if (data.message === "success") {
      $(".animateLayer").hide();
      getAllNote();
    }
  }

 function deleteNote(id) {
    
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#283618',
      cancelButtonColor: '#bc6c25',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
         axios.delete("https://route-egypt-api.herokuapp.com/deleteNote ",
          {
            data: {
              NoteID: id,
              token,
            },
          }
        ).then( (response)=> {  
          if (response.data.message === "deleted") {
            getAllNote();
            Swal.fire(
              'Your file has been deleted.',
            )
          }
        })
        
      }
    })
  }

  function closeNoteUpdate() {
    $(".animateLayerUpdate").hide();
  }
  function getNoteId(id) {
    $(".animateLayerUpdate").show();
    document.querySelector(".animateLayerUpdate input").value = allNotes[id].title
    document.querySelector(".animateLayerUpdate textarea").value = allNotes[id].desc

    setNewNotes({...newNotes, "title": allNotes[id].title , "desc": allNotes[id].desc, NoteID: allNotes[id]._id})
  }

  async function UpdateNote() {
    let { data } = await axios.put("https://route-egypt-api.herokuapp.com/updateNote ", newNotes);
    if (data.message === "updated") {
      $(".animateLayerUpdate").hide();
      getAllNote();
    }
  }

  return (
    <>
    {/* +++++++++++++++++Submit Modal+++++++++++++++++ */}
      <div className="d-flex align-items-center">
        <div className="animateLayer">
          <div className="layerNote position-fixed end-0 start-0 top-0 bottom-0">
            <div className="bgNote w-50 m-auto">
              <div className="headNote d-flex justify-content-between align-items-center border-bottom mb-3">
                <h5>Title</h5>
                <i onClick={closeNote} class="fa-solid fa-xmark fa-fw fa-xl"></i>
              </div>
              <div className="titleNote mb-1 border-bottom">
                <input onChange={getNotes} type="text" placeholder="Title" id="title" className="input-group mb-2 p-1 rounded-1"/>
                <textarea onChange={getNotes} id="desc" cols="30" placeholder="Type Your Note" className="input-group p-1 mb-3 rounded-1"></textarea>
              </div>
              <div className="btns d-flex justify-content-end mt-3 mb-1">
                <button onClick={submitNote} className="editContent text-white me-2">Add</button>
                <button onClick={closeNote} className="delContent">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </div>

         {/* ------------------Update Modal----------------- */}
         <div className="d-flex align-items-center">
        <div className="animateLayerUpdate">
          <div className="layerNote position-fixed end-0 start-0 top-0 bottom-0">
            <div className="bgNote w-50 m-auto">
              <div className="headNote d-flex justify-content-between align-items-center border-bottom mb-3">
                <h5>Title</h5>
                <i onClick={closeNoteUpdate} class="fa-solid fa-xmark fa-fw fa-xl"></i>
              </div>
              <div className="titleNote mb-1 border-bottom">
                <input onChange={getNotes} type="text" placeholder="Title" id="title" className="input-group mb-2 p-1 rounded-1"/>
                <textarea onChange={getNotes} id="desc" cols="30" placeholder="Type Your Note" className="input-group p-1 mb-3 rounded-1"></textarea>
              </div>
              <div className="btns d-flex justify-content-end mt-3 mb-1">
                <button onClick={UpdateNote} className="editContent text-white me-2">Update</button>
                <button onClick={closeNoteUpdate} className="delContent">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ==================Notes================== */}
        <div className="homeBg homeContent pt-5 mt-5">
        <div className="container ">
          <div className="row gy-4">
            {allNotes &&
              allNotes.map((note, idx) => (<>
                  {
                    <div key={(note._id, idx)} className="col-sm-6 col-md-4 col-lg-3">
                      <div className="note">
                     
                        <div className="contentNote">
                          <div className="homeBg rounded-3 p-1 mb-1">
                            <h3 className="mb-0 overflow-hidden">{note.title}</h3>
                          </div>
                        <p className="mb-2 overflow-hidden">{note.desc}</p>
                        </div>
                        <div className="homeBg rounded-3 d-flex">
                          <div className="icoMenu">
                            <div className="menuDots d-flex">
                              <div className="editContent"><h5 onClick={()=> getNoteId(idx)} >Edit</h5></div>
                              <div className="delContent"><h5 onClick={() => deleteNote(note._id)}>Delete</h5></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </>
              ))}

            <div className="parent position-relative">
              <div onClick={createNote} className="addNote">
                <i className="fa-solid fa-plus fa-fw fa-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
