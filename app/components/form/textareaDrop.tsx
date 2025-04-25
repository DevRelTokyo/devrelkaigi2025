import { useCallback, useContext, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ParseContext } from '~/contexts/parse';


interface TextAreaProps {
	key: string
	name: string;
	label: string;
	row?: number;
	placeholder: string;
	required: boolean;
	value: string;
	help?: string;
	status?: string;
	onChange: (value: string) => void;
}

export default function TextAreaDrop({ key, name, row, label, required, placeholder, value, help, onChange }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { Parse } = useContext(ParseContext)!;

  // 仮のアップロード処理（サーバー側にアップロードしてURLを取得）
  const uploadFile = async (f: File): Promise<string> => {
    // random 10文字のファイル名を生成
    const randomName = Math.random().toString(36).substring(2, 15);
    const file = new Parse.File(`${randomName}.${f.type.split('/')[1]}`, f);
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    // file.setACL(acl);
    const res = await file.save();
    return res.url();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log({ acceptedFiles });
    const textarea = textareaRef.current;
    console.log({ textarea });
    if (!textarea) return;
    for (const file of acceptedFiles) {
      const url = await uploadFile(file);
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        // GitHub風にMarkdown形式で貼る
        const insertText = `![${file.name}](${url})`;
        textarea.value = before + insertText + after;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = (before + insertText).length;
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true, accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }, multiple: false });

	return (<>
    <div {...getRootProps()} style={{ position: 'relative' }}>
      <input {...getInputProps()} />
      <div className="mb-3" key={key}>
        <label htmlFor={`input-${name}`} className="form-label">{label}</label>
        {help && <div id={`${name}Help`} className="form-text">{help}</div>}
        <textarea
          className="form-control"
          ref={textareaRef}
          style={{ height: 'auto' }}
          rows={row || 3}
          aria-describedby={`${name}Help`}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          value={value}
          required={required}
        >{value}</textarea>
      </div>
    </div>
	</>);
}