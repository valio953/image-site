import Table from "react-bootstrap/Table";

const ListImagesAdmin = ({ images }) => {
  let n = 1;

  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Име на снимката</th>
          <th>Път</th>
          <th>Качено от потребител</th>
          <th>Дата на качване</th>
        </tr>
      </thead>
      <tbody>
        {images.map((image) => (
          <tr key={image.image_id}>
            <td>{n++}</td>
            <td>{image.user_id}</td>
            <td>{image.image_name}</td>
            <td>{image.image_path}</td>
            <td>{image.user_name}</td>
            <td>{image.image_date_created}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default ListImagesAdmin;
