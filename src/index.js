import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

function useForm({ initialValues, validationSchema, onSubmit }) {
  const [values, setvalues] = useState(initialValues);
  const [errors, seterrors] = useState({});

  const checkIsPresent = useCallback(
    async (path, value) => {
      if (!errors[path]) return;

      try {
        await validationSchema.validate(
          { ...values, [path]: value },
          {
            abortEarly: false,
          }
        );
        seterrors({});
      } catch (err) {
        const res = err.inner.filter((item) => item.path === path);
        if (res.length === 0)
          seterrors((s) => {
            return {
              ...s,
              [path]: undefined,
            };
          });
        else {
          seterrors((s) => {
            return {
              ...s,
              [path]: res[0].message,
            };
          });
        }
      }
    },
    [validationSchema, errors, seterrors, values]
  );

  useEffect(() => {
    if (Object.keys(errors).length === 0)
      Object.keys(initialValues).map((key) => {
        seterrors((s) => {
          return {
            ...s,
            [key]: undefined,
          };
        });
        return true;
      });
  }, [initialValues, seterrors, errors]);

  const handleChange = (keyPath) => {
    return (e) => {
      setvalues((s) => {
        return {
          ...s,
          [keyPath]: e.target.value,
        };
      });
      checkIsPresent(keyPath, e.target.value);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(values, {
        abortEarly: false,
      });
      try {
        await onSubmit(values);
      } catch (err) {
        // show server error
      }
    } catch (err) {
      // show field errors
      err.inner.map((item) => {
        seterrors((s) => {
          return {
            ...s,
            [item.path]: item.message,
          };
        });
        return true;
      });
    }
  };

  return [values, errors, handleChange, handleSubmit];
}

useForm.propTypes = {
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
  onSubmit: PropTypes.func,
};

useForm.defaultProps = {
  initialValues: {},
  validationSchema: {},
  onSubmit: () => {},
};

export default useForm;
