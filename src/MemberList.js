import './MemberList.css'

import Member from "./Member"

function MemberList (props) {

    return (
        <ul className="member-list">
            { props.data.map((member, i) => <li className='member' key={member.id}><Member member={member} /></li>) }
        </ul>
    )
}
export default MemberList