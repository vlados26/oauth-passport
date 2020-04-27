import { connect, connection, connections } from 'mongoose';
import { mongodb } from './keys';

connect(mongodb.dbURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

connection.on('open', () => {
    const db_data = connections[0];
    console.log(
        '\x1b[36m%s\x1b[0m',
        `connected to monodb:
    host_name: ${db_data.host},
    port_name: ${db_data.port},
    project_name: ${db_data.name}
    `
    );
});