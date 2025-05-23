import { CSSProperties, useState } from "react";
import Parse from "parse";

interface FileProps {
  key: string
  name: string;
  label: string;
  help?: string;
  accept?: string;
  value: Parse.File | undefined;
  preview?: boolean;
  required: boolean;
  status?: string;
  message?: string;
  url?: string;
  onChange: (e: Parse.File) => void;
}

export default function File({ key, name, accept, label, value, message, preview, help, url, onChange }: FileProps) {
  const defaultStyle: CSSProperties = {
    border: '3px dotted #555',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
  };
  const [style, setStyle] = useState<CSSProperties>(defaultStyle);
  const [file, setFile] = useState<Parse.File | undefined>(undefined);
  const [messageText, setMessageText] = useState<string>(message!);

  const onDragover = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStyle({
      ...style,
      backgroundColor: '#f0f0f0',
      border: '5px dotted #333',
    });
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (accept && !file?.type.match(accept)) {
      setMessageText('Invalid file type');
      setStyle({
        ...style,
        backgroundColor: '#f0f0f0',
        border: '5px dotted #f00',
      });
      setTimeout(() => {
        setMessageText(message!);
        setStyle(defaultStyle);
      }, 3000);
      return;
    }
    // random file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const ext = file?.name.split('.').pop();
    const newFile = new Parse.File(`${fileName}.${ext}`, file);
    try {
      await newFile.save();
      setFile(newFile);
      onChange(newFile);
    } catch (error) {
      setMessageText((error as Parse.Error).message);
      setStyle({
        ...style,
        backgroundColor: '#ffcccc',
        fontSize: '18px',
        color: '#000',
        fontWeight: 'bold',
        border: '8px dotted #f00',
      });
      setTimeout(() => {
        setMessageText(message!);
        setStyle(defaultStyle);
      }, 10000);
    }
  };

  const onDragleave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStyle({
      ...style,
      backgroundColor: '',
      border: '3px dotted #555',
    });
  };

  return (<>
    <div className="mb-3" key={key}>
      <label htmlFor={`input-${name}`} className="form-label">{label}</label>
      {preview ?
        (
          <div className="row">
            <div className="col-6"
              style={{
                height: '300px',
                display: 'table',
              }}
            >
              <div style={style}
                onDragOver={onDragover}
                onDragLeave={onDragleave}
                onDrop={onDrop}
              >
                {messageText}
              </div>
            </div>
            <div className="col-6" style={{
              textAlign: 'center',
            }}>
              {file ? (<>
                <img
                  src={file.url()}
                  className="img-fluid"
                  alt=""
                  width={300}
                  height={300}
                />
              </>) : (
                <img
                  src={`${value ? value.url : url || "/assets/images/icon/user_preview.png"}`}
                  className="img-fluid"
                  alt=""
                  width={300}
                  height={300}
                />
              )}
            </div>
          </div>
        )
        : (<>
          <div></div>
        </>)
      }
      {help && <div id={`${name}Help`} className="form-text">{help}</div>}
    </div>
  </>);
}