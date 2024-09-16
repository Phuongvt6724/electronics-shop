import "../styles/components/loader.css";

export function LoaderModel() {
  return (
    <div className="loaderModel">
      <div className="bar1"></div>
      <div className="bar2"></div>
      <div className="bar3"></div>
      <div className="bar4"></div>
      <div className="bar5"></div>
      <div className="bar6"></div>
      <div className="bar7"></div>
      <div className="bar8"></div>
      <div className="bar9"></div>
      <div className="bar10"></div>
      <div className="bar11"></div>
      <div className="bar12"></div>
    </div>
  );
}

function Loader() {
  return (
    <div className="loader">
      <div className="cell d-0"></div>
      <div className="cell d-1"></div>
      <div className="cell d-2"></div>

      <div className="cell d-1"></div>
      <div className="cell d-2"></div>

      <div className="cell d-2"></div>
      <div className="cell d-3"></div>

      <div className="cell d-3"></div>
      <div className="cell d-4"></div>
    </div>
  );
}

export default Loader;
