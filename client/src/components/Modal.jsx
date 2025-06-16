import ReactDOM from "react-dom";

function Modal({ children }) {
    return ReactDOM.createPortal(
        <div className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            {children}
        </div>,
        document.body
    );
}

export default Modal;
