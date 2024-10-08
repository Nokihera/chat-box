import React from "react";
import preloader from "../assets/preloaderAnimation.webm";
const Preloader = () => {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <video autoPlay loop muted>
        <source src={preloader} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Preloader;
