import { useEffect, useState } from "react";
import Text from "./text";
import { Schema } from "~/types/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";

interface ArrayProps {
  key: string
  name: string;
  label: string;
  value: string[] | undefined;
  help?: string;
  status?: string;
  schema: Schema;
  onChange: (e: string[]) => void;
}

export default function ArrayField({ key, name, schema, label, value, help, onChange }: ArrayProps) {
  const [values, setValues] = useState<string[]>(value || []);

  const add = () => {
    setValues([...values, '']);
  };

  const change = (i: number, value: string) => {
    values[i] = value;
    setValues(values);
  };

  const remove = (i: number) => {
    values.splice(i, 1)
    setValues([...values]);
  };

  useEffect(() => {
    onChange(values);
  }, [values]);

  return (<>
    <div className="mb-3" key={key}>
      <div className="row">
        <div className="col-10">
          <label htmlFor={`input-${name}`} className="form-label">{label}</label>
        </div>
        <div className="col-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={add}
          >
            <FontAwesomeIcon icon={faCirclePlus} style={{ width: 35, height: 35 }} />
          </button>
        </div>
      </div>
      {help && <div id={`${name}Help`} className="form-text">{help}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="row">
                <div className="col-12">
                  {schema.label}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {values.map((v, i) => (
            <tr key={i}>
              <td>
                <div className="row">
                  <div className="col-10">
                    {[
                      'text', 'date', 'url', 'email', 'number'
                    ].indexOf(schema.type) > -1 &&
                      <Text
                        key={`${i}`}
                        type={schema.type}
                        name={`${name}[${i}]`}
                        placeholder={schema.placeholder!}
                        required={schema.required!}
                        value={v as string}
                        onChange={(value: string) => change(i, value)}
                      />
                    }
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => remove(i)}
                    >
                      <FontAwesomeIcon icon={faCircleMinus} style={{ width: 35, height: 35 }} />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  </>);
}