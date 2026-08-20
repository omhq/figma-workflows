import WorkflowAlert from './WorkflowAlert'

export default function WarningAlert(props) {
  return <WorkflowAlert variant="warning" autoCloseTime={5000} {...props} />
}
