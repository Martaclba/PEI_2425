import { Form } from "react-router-dom";
import { HiOutlineUpload } from "react-icons/hi";

function Delegados() {
  const contact = {
    first: "Your",
    last: "Name",
    avatar: "https://robohash.org/you.png?size=200x200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };
  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);

  return (
    <div id="contact">
      
      <div>
        
        <h1>Consultar Delegados</h1>

        <div id="data-import">
          <p>{date}</p>
          <HiOutlineUpload/>
        </div>
        
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!window.confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}>
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Delegados