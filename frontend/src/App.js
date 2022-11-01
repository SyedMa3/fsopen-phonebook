import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({newSearch, handleSearchChange}) => (
  <div>filter shown with
        <input 
          value={newSearch}
          onChange={handleSearchChange}
        />
  </div>
)

const PersonForm = ({addPerson, newName, handleNameChange}) => {
  
  return (
    <div>
      <form onSubmit={addPerson}>
          <div>
            name: <input
              value={newName.name}
              onChange={handleNameChange}
              name="name"
              />
          </div>
          <div>
            number: <input
              value={newName.number}
              onChange={handleNameChange}
              name="number"
              />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    </div>
  )
}

const Persons = ({persons, newSearch, removePerson}) => {
  
  const filterNames = () => {
    const filtered = persons.filter(
      person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
    
    return filtered.map(person => 
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>remove</button>
      </li>)
  }

  return (
    <div>
      <ul>
        {filterNames()}
      </ul>
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState({
    name: '',
    number: ''
  })

  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(element => element.name === newName.name)
    if(found) {
      if(window.confirm(`${newName.name} is already added to phonebook, replace the old number with new one?`))
      {
        personService
          .update(found.id, newName)
          .then(response => {
            // console.log(found.id);
            setPersons(persons.map(p => p.id !== found.id ? p : response.data))
          })
      }
    }
    else {
      const personObject = {
        name: newName.name,
        number: newName.number,
        // id: persons.length + 1
      }
      // console.log(JSON.stringify(personObject));
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
    }
    setNewName({
      name: '',
      number: ''
    })
  }

  const removePerson = (id) => {

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(err => {
        alert(`note not found`)
      })
  }

  const handleNameChange = (event) => {
    const {name, value} = event.target
    setNewName({
      ...newName,
      [name]: value
    })
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}/>

      <h2>Numbers</h2>
      <Persons persons={persons} newSearch={newSearch} removePerson={removePerson}/>
    </div>
  )
}

export default App