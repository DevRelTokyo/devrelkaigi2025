export interface MessageProps {
	messages: string[];
	type: string;
}

export default function Message({ message }: { message?: MessageProps }) {
	return (
    <div className="row">
      <div className="col-8 offset-2">
        {message && (
          <div className={`alert alert-${message.type}`} role="alert"
            style={{
              position: "fixed",
              top: "50px",
              right: "50px",
              width: "600px",
              zIndex: 9999,
              borderRadius: "0px",
            }}
          >
            <ul
              style={{listStyleType: 'none', padding: 0}}
            >
              {message.messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
	);
}