import TextEditor from './TextEditor.jsx';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

function App() {
    function createNewDocument() {
        const id = uuidv4();
        const socket = io('http://localhost:3001');
        socket.emit('create-document', id);
        return <Redirect to={`/document/${id}`} />
    }


    return (
        <Router>
            <Switch>
                <Route path="/new" render={createNewDocument} />
                <Route path="/document/:id">
                    <TextEditor />
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
