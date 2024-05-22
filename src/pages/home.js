import {useEffect, useState, useRef} from "react";
import {filterEventsByDr, getEvents, getEventsBusyTimes, processEvents} from "../services/gcalendar";
import {Accordion, Dropdown} from "react-bootstrap";

const months = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
const Home = () => {

  const [allEvents, setAllEvents] = useState({});
  const allEventsList = useRef({});

  useEffect(() => {
    //TODO check how data is written for "indisponibil"
    const date = new Date();
    getEvents(new Date(date.getFullYear(), date.getMonth() - 1, 1))
      .then((res) => {
        const summaryData = ["nume-pacient", "telefon-pacient", "serviciu", "medic", "programare-făcută-de"]
        const appointments = res.map((obj, index) => {
          const newObjAppointment = {"programarea-originală": obj.summary}

          if (!obj.summary.toLowerCase().includes("indisponibil")) {
            summaryData.forEach((key, index) => {
              newObjAppointment[key] = obj.summary.split("/")[index];
            })
          } else {
            summaryData.forEach((elem, index) => {
              newObjAppointment[elem] = "";
            })
          }
          if (obj?.start) {
            const dateAndTime = obj.start.split("T");
            newObjAppointment["zi-start"] = dateAndTime[0];
            newObjAppointment["timp-start"] = dateAndTime[1].split("+")[0].substring(0, 5);
          } else if (obj?.startDate) {
            newObjAppointment["zi-start"] = obj.startDate;
            newObjAppointment["timp-start"] = "";
          }
          if (obj.end) {
            const dateAndTime = obj.end.split("T");
            newObjAppointment["zi-end"] = dateAndTime[0];
            newObjAppointment["timp-end"] = dateAndTime[1].split("+")[0].substring(0, 5);
            ;
          } else if (obj?.endDate) {
            newObjAppointment["zi-end"] = obj.endDate;
            newObjAppointment["timp-end"] = "";
          }
          return newObjAppointment
        })
        appointments.sort((objA, objB) => {
          if (new Date(objA["zi-start"]).getDate() < new Date(objB["zi-start"]).getDate()) return -1;
          return 1;
        })
        const appointmentsByDay = {};
        appointments.forEach(appointment => {
          if (appointmentsByDay[appointment["zi-start"]]) {
            appointmentsByDay[appointment["zi-start"]].push(appointment)
          } else {
            appointmentsByDay[appointment["zi-start"]] = [appointment]
          }
        })
        console.log(appointmentsByDay)
        setAllEvents(appointmentsByDay);
        allEventsList.current = appointmentsByDay;
      })
      .catch(error => {
        console.log(error)
      })

  }, []);

  const renderCardContent = (calendarEvent) => {
    return <>
      <p className="me-2 p-1 rounded text-bg-primary">{(calendarEvent["zi-start"] === calendarEvent["zi-end"]) ?
        `${calendarEvent["zi-start"]} ${calendarEvent["timp-start"]} -> ${calendarEvent["timp-end"]}`
        :
        `${calendarEvent["zi-start"]}-${calendarEvent["timp-start"]} -> ${calendarEvent["zi-end"]}-${calendarEvent["timp-end"]}`}</p>
      <p className="me-2 p-1 rounded text-bg-primary">{calendarEvent["medic"]}</p>
      <div>
        <p><span className="me-2 p-1 rounded text-bg-success">Nume pacient:</span>{calendarEvent["nume-pacient"]}</p>
        <p><span className="me-2 p-1 rounded text-bg-success">Telefon pacient:</span>{calendarEvent["telefon-pacient"]}
        </p>
        <p><span className="me-2 p-1 rounded text-bg-success">Serviciu:</span>{calendarEvent["serviciu"]}</p>
      </div>
    </>
  }

  return (
    <div>
      <h1 className="text-center">Panou Programări</h1>
      <div
        className="d-flex justify-content-between max-w-40 mx-auto subheader sticky-top bg-dark p-3 rounded home-event-card custom-box-shadow ">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Selectează Luna
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {months.map((month, index) => (
              <Dropdown.Item eventKey={index}>{month}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <label className="text-secondary">
          Adaugă o programare
          <button className="btn btn-primary rounded-circle ms-2">+</button>
        </label>

      </div>

      <Accordion defaultActiveKey={0} className="max-w-40 mx-auto custom-box-shadow">
        {Object.keys(allEvents).map((startDate, index) => (
          <Accordion.Item eventKey={index} className="bg-dark">
            <Accordion.Header>{startDate}</Accordion.Header>
            <Accordion.Body>
              <div className="home-events-list-container">
                {allEvents[startDate]?.sort((objA, objB) => {
                  if (Number(objA["timp-start"].replace(":", "")) < Number(objB["timp-start"].replace(":", ""))) return -1;
                  return 1;
                }).map(calendarEvent => (
                  <div className="home-event-card max-w-40 mx-auto text-white">
                    {renderCardContent(calendarEvent)}
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

export default Home;