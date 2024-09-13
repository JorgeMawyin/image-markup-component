import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        zIndex: 1,
        color: "black",
      }}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
};

export const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        zIndex: 1,
        color: "black",
      }}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
};
