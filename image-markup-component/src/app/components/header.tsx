/* eslint-disable @typescript-eslint/prefer-as-const */
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const Header: React.FC = () => {
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Image Markup Component</h1>
        <CloseIcon style={iconStyle} />
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: "#16325B",
  color: "#fff",
  padding: "10px 0",
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative" as "relative",
};

const titleStyle = {
  flex: 1,
  textAlign: "center" as "center",
};

const iconStyle = {
  position: "absolute" as "absolute",
  right: "10px",
  cursor: "pointer",
};

export default Header;