# react-useForm

## Example

```jsx
import React from "react";

// import Yup and useForm
import * as Yup from "yup";
import useForm from "@kavre/react-useform";

const Form = () => {
  const [values, errors, handleChange, handleSubmit] = useForm({
    initialValues: {
      // define your initial value here
      name: "",
    },
    validationSchema: Yup.object({
      // define your schema here
      name: Yup.string().min(6, "Name must be minimum 6 letter"),
    }),
    onSubmit: async (vals) => {
      // perform you submit action
      console.log(vals);
    },
  });

  return (
    //   use handleSubmit onSubmit of your form
    <form onSubmit={handleSubmit}>
      {/* use handle submit in this way */}
      <input type="text" value={handleChange("name")} value={values.name} />

      {/* errors will be accessed by this way */}
      <span>Error: {errors.name}</span>

      <input type="submit" value="submit" />
    </form>
  );
};

export default Form;
```
