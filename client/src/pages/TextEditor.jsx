import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../plugins/cursors.css";
import io from "socket.io-client";
import "../style.css";
import QuillCursors from "../plugins/Cursors";
import { useNavigate } from "react-router-dom";

Quill.register("modules/cursors", QuillCursors);

import { Layout, Typography, Button, message } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const TOOLBAR_OPTIONS = [
    [{ size: [] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "link", "code-block"],
    ["clean"],
];

function TextEditor() {
    const navigate = useNavigate();

    const [quill, setQuill] = useState();
    const [documentFound, setDocumentFound] = useState(true);
    const [documentTitle, setDocumentTitle] = useState();
    const [documentSaving, setDocumentSaving] = useState(false);
    const { id: documentId } = useParams();

    const socket = io("ws://localhost:3001");

    // Initial document loading
    useEffect(() => {
        if (!quill) return;

        socket.once("load-document", (document) => {
            quill.enable();
            quill.setContents(document.data);
            setDocumentTitle(document.name);
        });

        socket.once("document-not-found", () => {
            setDocumentFound(false);
        });

        socket.emit("get-document", documentId);
    }, [quill, documentId]);

    // Receiving changes
    useEffect(() => {
        if (!quill) return;

        const onReceiveChanges = (delta) => {
            quill.updateContents(delta);
        };

        socket.on("receive-changes", onReceiveChanges);

        return () => {
            socket.off("receive-changes", onReceiveChanges);
        };
    }, [quill, documentId]);

    // Sending changes
    useEffect(() => {
        if (!quill) return;

        const onTextChange = (delta, oldDelta, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", delta);
        };

        const onEditorChange = (eventName, ...args) => {
            if (eventName == "selection-change") {
                quill.getModule("cursors").moveCursor("test1", args[0]);
            }
        };

        quill.on("text-change", onTextChange);
        quill.on("editor-change", onEditorChange);

        return () => {
            quill.off("text-change", onTextChange);
            quill.on("editor-change", onEditorChange);
        };
    }, [quill, documentId]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS, cursors: true },
        });
        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);

    async function saveDocument() {
        socket.emit("save-document", quill.getContents());
        setDocumentSaving(true);
        socket.once("save-successful", () => {
            setDocumentSaving(false);
            message.success("Document saved successfully");
        });
    }

    if (documentFound) {
        return (
            <Layout>
                {/* <PageHeader
                    title={documentTitle}
                    extra={[
                        <Button loading={documentSaving} onClick={saveDocument} type="primary">Save Document</Button>
                    ]}
                    ghost={false}
                    onBack={() => history.push("/")}
                >
                    <Descriptions size="small">
                        <Descriptions.Item label="Author">Nick Tenebruso</Descriptions.Item>
                    </Descriptions>
                </PageHeader> */}
                <Content
                    style={{
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 40px",
                    }}
                >
                    <Title level={2}>{documentTitle}</Title>
                    <div style={{ display: "flex", columnGap: "10px" }}>
                        <Button onClick={() => navigate(-1)}>
                            Back to home
                        </Button>
                        <Button
                            loading={documentSaving}
                            onClick={saveDocument}
                            type="primary"
                        >
                            Save Document
                        </Button>
                    </div>
                </Content>
                <div className="container" ref={wrapperRef}></div>
            </Layout>
        );
    } else {
        return <div>Document was not found</div>;
    }
}

export default TextEditor;
