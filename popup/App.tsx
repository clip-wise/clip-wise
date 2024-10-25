import "./css/global.css";
import Logo from "../public/images/logo.svg";
import Play from "../public/images/play.svg";

export const App = () => {
  return (
    <div className="flex flex-col justify-between h-32 w-28 p-3">
      <div className="flex flex-col items-center gap-x-2 w-full mb-auto">
        <img className="h-12" src={Logo} alt="logo" />
        <p className="font-lg font-bold">ClipWise</p>
      </div>
      <div className="flex w-full justify-center">
        <button className="border rounded-lg border-blue-600 bg-blue-300 flex p-1 px-2 gap-x-2">
          <img className="display-inline h-4" src={Play} alt="play" />
          start
        </button>
      </div>
    </div>
  );
};
