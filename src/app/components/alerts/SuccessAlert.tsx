import WorkflowAlert from './WorkflowAlert'

export default function SuccessAlert(props) {
  return <WorkflowAlert variant="success" autoCloseTime={1000} {...props} />
}
