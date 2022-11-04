const Notification = ({ message, notificationColor }) => {
  const style = {
    color: notificationColor,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === null) {
    return null
  }

  return(
    <div className='notification' style={style}>{message}</div>
  )
}

export default Notification