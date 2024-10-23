import React from "react";

const HourglassContainer = ({ className = "", fill = "#090E28" }) => {
  return (
    <div>
      <svg
        width="761"
        height="1918"
        viewBox="0 0 761 1918"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M437.854 928C437.854 956.257 456.674 981.009 483.853 988.668C643.774 1033.74 761 1180.78 761 1355.23V1918H0V1355.23C0 1180.78 117.226 1033.74 277.147 988.668C304.326 981.009 323.146 956.262 323.146 928C323.146 899.743 304.326 874.991 277.147 867.332C117.226 822.268 0 675.215 0 500.767V-62H761V500.767C761 675.215 643.774 822.264 483.853 867.332C456.674 874.991 437.854 899.738 437.854 928Z"
          fill="currentColor"
        />
      </svg>
      {/* <div className="h-48 w-full bg-hourglass sm:hidden border-hourglass border-hidden" /> */}
    </div>
  );
};

export default HourglassContainer;