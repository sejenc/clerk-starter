import './Member.css'

function Member(props) {
    const { member } = props
    return (
        <div>
            <p>{member.displayName} - {member.stateCode}</p>
        </div>
    ) 
}
export default Member