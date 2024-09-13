/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  IconButton,
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PrevArrow, NextArrow } from "./Arrows";

interface Note {
  id: number;
  imageId: number;
  x: number;
  y: number;
  text: string;
  isEditing: boolean;
  customIcon?: string | null;
}

const ImageCarouselWithNotes = () => {
  const [images, setImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const noteIdRef = useRef(0);
  const [currentimageId, setCurrentimageId] = useState(0);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNotePosition, setNewNotePosition] = useState<{
    x: number;
    y: number;
  } | null>(null); // Posicion de la nueva nota
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setNewNotePosition({ x: xPercent, y: yPercent }); // Setear la posicion de la nueva nota
    setIsDialogOpen(true);
  };

  // Manejar el cambio de texto de la nota
  const handleNoteTextChange = (noteId: number, text: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, text, isEditing: false } : note
      )
    );
  };

  // Manejar la edicion de la nota
  const handleEditNote = (noteId: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, isEditing: true } : note
      )
    );
  };

  // Manejar la eliminacion de la nota
  const handleNoteDelete = (noteId: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  // Manejar el arrastre de la nota
  const handleMouseDown = (noteId: number) => {
    setIsDragging(noteId);
  };

  // Manejar el movimiento del mouse para arrastrar la nota
  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    imageId: number
  ) => {
    if (isDragging !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === isDragging && note.imageId === imageId
            ? { ...note, x: xPercent, y: yPercent }
            : note
        )
      );
    }
  };

  // Manejar el levantamiento del mouse
  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Manejar el cierre del dialogo
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewNoteText("");
    setNewNotePosition(null);
    setSelectedIcon(null);
  };

  // Manejar la subida de la imagen para la nota personalizada
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedIcon(URL.createObjectURL(file));
    }
  };

  // Agregar una nueva nota
  const handleAddNote = () => {
    if (newNoteText && newNotePosition) {
      const newNote = {
        id: noteIdRef.current++,
        imageId: currentimageId,
        x: newNotePosition.x,
        y: newNotePosition.y,
        text: newNoteText,
        isEditing: false,
        customIcon: selectedIcon || null,
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
      handleCloseDialog();
    }
  };

  const settings = {
    dots: false,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentimageId(current),
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    swipe: false,
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <label
          htmlFor="imageUpload"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Agregar imagen
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="h-[500px] w-full mx-auto relative mt-8">
          {images.length > 0 ? (
            <>
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full h-[500px]"
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onMouseUp={handleMouseUp}
                  >
                    <img
                      src={image}
                      alt={`Uploaded ${index}`}
                      className="w-full h-full object-contain"
                      onClick={handleImageClick} // Abrir dialogo para agregar una nueva nota
                    />
                    {notes
                      .filter((note) => note.imageId === index)
                      .map((note, noteIndex) => (
                        <div
                          key={note.id}
                          className="absolute cursor-pointer"
                          style={{
                            top: `${note.y}%`,
                            left: `${note.x}%`,
                            transform: "translate(-50%, -50%)",
                            width: "40px",
                            height: "40px",
                          }}
                          onMouseDown={() => handleMouseDown(note.id)}
                        >
                          {/* Mostar el icono personalizado o el icono por defecto */}
                          {note.customIcon ? (
                            <img
                              src={note.customIcon}
                              alt="Custom icon"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="bg-blue-600 text-white w-full h-full flex items-center justify-center font-bold rounded-full">
                              {noteIndex + 1}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </Slider>
            </>
          ) : (
            <p>No hay imágenes subidas</p>
          )}
        </div>
      </div>

      <div className="w-1/2 pl-4 mt-16 mr-4">
        {notes.filter((note) => note.imageId === currentimageId).length >
        0 ? (
          notes
            .filter((note) => note.imageId === currentimageId)
            .map((note, noteIndex) => (
              <div
                key={note.id}
                className="flex items-center mb-4 p-4 border border-blue-600 rounded-md"
              >
                {/* Mostar el icono personalizado o el icono por defecto */}
                <div className="text-lg font-bold text-blue-600">
                  {note.customIcon ? (
                    <img
                      src={note.customIcon}
                      alt="Custom icon"
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  ) : (
                    noteIndex + 1
                  )}
                </div>
                {note.isEditing ? (
                  <Input
                    value={note.text}
                    placeholder="Escribe tu nota..."
                    onChange={(e) =>
                      setNotes((prevNotes) =>
                        prevNotes.map((n) =>
                          n.id === note.id ? { ...n, text: e.target.value } : n
                        )
                      )
                    }
                    onBlur={() => handleNoteTextChange(note.id, note.text)}
                    autoFocus
                    className="ml-4 flex-1 text-black"
                  />
                ) : (
                  <div className="ml-4 flex-1 text-black">{note.text}</div>
                )}
                <IconButton
                  onClick={() => handleEditNote(note.id)}
                  className="ml-2"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleNoteDelete(note.id)}
                  className="ml-1"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
        ) : (
          <p>No hay marcas aún.</p>
        )}
      </div>

      {/* Modal para agregar una nueva nota */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Agregar Nota</DialogTitle>
        <DialogContent>
          <Input
            placeholder="Escribe tu nota..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            fullWidth
            autoFocus
          />
          <div className="mt-4">
            <label htmlFor="iconUpload" className="block mb-2">
              Selecciona una imagen como para una nota personalizada (opcional):
            </label>
            <label
              htmlFor="iconUpload"
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mb-4"
            >
              Agregar imagen
            </label>
            <input
              id="iconUpload"
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              className="hidden"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleAddNote}
            color="primary"
            disabled={!newNoteText}
          >
            Agregar Nota
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageCarouselWithNotes;
