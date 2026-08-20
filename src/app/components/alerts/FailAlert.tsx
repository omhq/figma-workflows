import WorkflowAlert from './WorkflowAlert'

export default function FailAlert(props) {
  return <WorkflowAlert variant="destructive" autoCloseTime={5000} {...props} />
}
