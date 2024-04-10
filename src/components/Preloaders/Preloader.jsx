import Style from "../../styles/components/preloaders/preloader/preloader.module.scss";

// прелоадер для прогрузки прежде чем показать контент
const Preloader = () => {
  return (
    <div style={{ width: "100%" }}>
      <div className={Style.linear_activity}>
        <div className={Style.indeterminate}></div>
      </div>
    </div>
  );
};

export default Preloader;
