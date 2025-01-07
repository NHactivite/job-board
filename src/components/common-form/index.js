const { Button } = require("../ui/button");
const { Input } = require("../ui/input");
const { Label } = require("../ui/label");

export default function CommonFrom({
  action,
  buttonText,
  isBtnDisabled,
  btnType,
  formControls,
  formData,
  setFormData,
  handleFileChange,
  uploadFile,
  fileStatus,
}) {
  const renderInputByCommponentType = (getCurrentControl) => {
    let content = null;

    switch (getCurrentControl.componentType) {
      case "input":
        content = (
          <div className="relative flex items-center mt-8">
            <Input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full rounded-md h-[60px] px-4 border bg-gray-100 text-lg outline-none  drop-shadow-sm translate-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        );
        break;

      case "file":
       
        content = (
          <>
            <Label
              htmlFor={getCurrentControl.name}
              className="flex bg-gray-100 items-center px-3 py-3 mx-auto mt-6 text-center border-2 border-dashed rounded-lg cursor-pointer"
            >
              <div className="flex justify-between w-full gap-5 items-center">
                <h2>{getCurrentControl.label}</h2>
                <Input
                  onChange={handleFileChange}
                  id={getCurrentControl.name}
                  type="file"
                />
                <Button 
                type="button" 
                onClick={uploadFile}>
                  {fileStatus ? "Remove" : "Upload"}
                </Button>
              </div>
            </Label>
            {formData[getCurrentControl.name] && (
              <div>
                <span className="mx-3">
                  {formData[getCurrentControl.name].split("/").pop().replace(/_[^/]+$/, '')}
                </span>
              <Button
              type="button"
              onClick={() => window.open(formData[getCurrentControl.name], "_blank")}
              className="text-white mt-3 mx-3"
              disabled={formData[getCurrentControl.name]===""}
            >
              View Resume File
            </Button>
            
              </div>
            )}
           
          </>
        );

        break;

      default:
        content = (
          <div className="relative flex items-center mt-8">
            <Input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full rounded-md h-[60px] px-4 border bg-gray-100 text-lg outline-none  drop-shadow-sm translate-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        );
        break;
    }
    return content;
  };

  return (
    <form action={action}>
      {formControls.map((control, idx) => (
        
        <div key={idx}>
          
          {renderInputByCommponentType(control)}</div>
      ))}
      <div className="mt-6 w-full">
        <Button
          className="disabled:opacity-60 flex h-11 items-center justify-center px-5"
          type={btnType || "submit"}
          disabled={isBtnDisabled}
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}
