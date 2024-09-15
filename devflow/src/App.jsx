import {
  Admin,
  Resource,
} from "react-admin";
import TicketList from "./components/TicketList"
import { dataProvider } from "./dataProvider";

export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="tickets"
      list={TicketList}
    />
  </Admin>
);

export default App;