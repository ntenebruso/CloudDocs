import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import MainLayout from "../components/Layout";
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

import { Table, Button, Modal, Input } from "antd";

export default function Dashboard() {
    const history = useHistory();
    const user = useContext(UserContext);
    const [socket, setSocket] = useState();
    const [documents, setDocuments] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [titleVal, setTitleVal] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socketState = io("ws://localhost:3001");
        setSocket(socketState);
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3001/api/user-documents", { withCredentials: true }).then(res => {
            setDocuments(res.data);
            setLoading(false);
        })
    }, [])

    const columns = [
        {
            title: "Title",
            dataIndex: "name",
            render: (text, row, index) => <Link to={`/document/${documents[index]._id}`}>{text}</Link>,
            key: "id"
        }
    ];

    function handleModal() {
        setModalOpen(!modalOpen);
    }
    
    function createNewDocument() {
        const id = uuidv4();
        socket.emit('create-document', id, titleVal, user._id);
        socket.once("document-created", () => {
            history.push(`/document/${id}`);
        })
    }

    return (
        <>
            <Modal title="Create Document" visible={modalOpen} onCancel={handleModal} onOk={createNewDocument}>
                <Input type="text" placeholder="Document name" onChange={e => setTitleVal(e.target.value)}></Input>
            </Modal>
            <MainLayout>
                <h1>Welcome, {user.username}</h1>
                <Button type="primary" onClick={handleModal} style={{ margin: "16px 0" }}>Create</Button>
                <Table columns={columns} dataSource={documents} loading={loading} />
            </MainLayout>
        </>
    )
}