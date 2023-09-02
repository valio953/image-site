import Table from "react-bootstrap/Table";

const ListUsers = ({ users }) => {
  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>Потребител</th>
          <th>Брой Снимки</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id}>
            <td>{user.user_name}</td>
            <td>{user.uploaded_images}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default ListUsers;
