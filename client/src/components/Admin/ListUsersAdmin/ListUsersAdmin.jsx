import Table from "react-bootstrap/Table";

const ListUsersAdmin = ({ users }) => {
  let n = 1;

  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Име</th>
          <th>Email</th>
          <th>Дата на регистрация</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id}>
            <td>{n++}</td>
            <td>{user.user_id}</td>
            <td>{user.user_name}</td>
            <td>{user.user_email}</td>
            <td>{user.user_date_created}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default ListUsersAdmin;
