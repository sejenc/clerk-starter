import { useEffect, useState } from 'react'

import './App.css'

import MemberList from "./MemberList"

async function getMembers (count = null) {
  let url = `https://clerkapi.azure-api.net/Members/v1/?key=${process.env.REACT_APP_CLERK_API_KEY}&$filter=active eq 'yes'&$orderby=sortName`
  if (count) {
    url += `&$skip=${count * 10}`
  }
  console.log('get members')
  const response = await fetch(url)
  return response.json()
}

function App() {
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({})
  const [sort, setSort] = useState({type: 'sortName', direction: 'asc'})

  function incrementPage () {
    setCount(count + 1)
  }

  function decrementPage () {
    setCount(count - 1)
  }

  function updateSort (sort) {
    setSort(sort)
  }

  function sortBy (name, direction) {
    if (direction === 'asc') {
      return function (a,b) {
        console.log('asc - ', a[name])
        console.log('asc - ', b[name])
        if (a[name] < b[name]) {
          return -1
        } else if (a[name] > b[name]) {
          return 1
        }
        return 0
      }
    } else {
      return function (a,b) {
        console.log('desc - ', a[name])
        console.log('desc - ', b[name])
        if (a[name] > b[name]) {
          return -1
        } else if (a[name] < b[name]) {
          return 1
        }
        return 0
      }
    }
  }

  useEffect(() => {
    getMembers().then(memberData => {
      const { results, pagination } = memberData
      const members = results.map(m => {
        const currentCongress = m.congresses.find(c => c.congressNum === '117')
        const obj = {
          id: m._id,
          displayName: m.bioGivenNames,
          sortName: m.sortName,
          ...currentCongress,
        }
        return obj
      })
      setData(members)
      setMeta(pagination)
    })
  }, [])

  const [count, setCount] = useState(0)
  useEffect(() => {
    getMembers(count).then(memberData => {
      const { results, pagination } = memberData
      const members = results.map(m => {
        const currentCongress = m.congresses.find(c => c.congressNum === '117')
        const obj = {
          id: m._id,
          displayName: m.bioGivenNames,
          sortName: m.sortName,
          ...currentCongress,
        }
        return obj
      })
      setData(members)
      setMeta(pagination)
    })
  }, [count])

  useEffect(() => {

    const { type, direction } = sort
    const result = data.sort(sortBy(type, direction))

    console.log('result', result)
    
    setData(result)

  }, [sort, data])

  return (
    <div className="wrapper">
      {JSON.stringify(sort)}
      <h1>House of Representatives Members - 117th Congress</h1>               
      <div className="container">
        <div className="table">
          <MemberList data={data} />
          <div className="table-actions">
            <button type="button" onClick={decrementPage}>Prev</button>
            <button type="button" onClick={incrementPage}>Next</button>
            <p>{1 + (meta.page * 10)} - {(meta.page + 1) * 10} of {meta.count} members</p>
          </div>
        </div>
        <div className="sort">
          <p><strong>sort</strong></p>
          <ul>
            <li onClick={() => updateSort({type: 'sortName', direction: 'asc'})}>
              Last Name: A-Z
            </li>
            <li onClick={() => updateSort({type: 'sortName', direction: 'desc'})}>
              Last Name: Z-A
            </li>
            <li onClick={() => updateSort({type: 'stateCode', direction: 'asc'})}>State: A-Z</li>
            <li onClick={() => updateSort({type: 'stateCode', direction: 'desc'})}>State: Z-A</li>
          </ul>
      </div>
      </div>
    </div>
  )
}

export default App
