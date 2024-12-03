import { ReactElement, useCallback, useState } from "react"
import { Button, Confirm, ConfirmProps } from "react-admin"

export type ActionButtonProps = {
  onConfirm: (() => any) | undefined
  confirmProps?: Omit<ConfirmProps, "onConfirm" | "onClose" | "isOpen"> | null
  isShow?: boolean | (() => boolean)
  label: string
  icon?: ReactElement<any>
}

const ActionButton = ({
  onConfirm,
  confirmProps = null,
  isShow = true,
  label,
  icon,
}: ActionButtonProps) => {
  const show = typeof isShow === "function" ? isShow() : isShow
  const [confirming, setConfirming] = useState(false)

  const handleCancel = useCallback(() => setConfirming(false), [setConfirming])

  const handleConfirm = useCallback(() => {
    if (!onConfirm) {
      return
    }
    onConfirm()
    setConfirming(false)
  }, [onConfirm, setConfirming])

  const clickHandler = useCallback(() => {
    if (confirmProps != null) {
      setConfirming(true)
    } else {
      handleConfirm()
    }
  }, [onConfirm, confirmProps])

  return (
    <>
      {show && (
        <Button label={label} color={"primary"} onClick={clickHandler}>
          <>
            {icon}
            <span style={{ height: "1em", lineHeight: "1em" }}></span>
          </>
        </Button>
      )}
      {confirmProps && (
        <Confirm
          isOpen={confirming}
          {...confirmProps}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </>
  )
}

export default ActionButton
