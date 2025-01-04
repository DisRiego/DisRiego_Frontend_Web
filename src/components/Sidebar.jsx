import Option from "./dashboard/sidebar/option";
import Option_user from "./dashboard/sidebar/option_user";

const Sidebar = ({ handleOptionChange, selectedOption }) => {
  return (
    <>
      <Option_user
        handleOptionChange={handleOptionChange}
        selectedOption={selectedOption}
      />
    </>
  );
};

export default Sidebar;
