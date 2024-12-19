import { ReactElement, useCallback, useState } from "react"
import { Button, Confirm, ConfirmProps, useRefresh } from "react-admin"

export type ActionButtonProps = {
  onConfirm: (() => any) | undefined
  confirmProps?: Omit<ConfirmProps, "onConfirm" | "onClose" | "isOpen"> | null
  isShow?: boolean | (() => boolean)
  label: string
  icon?: ReactElement<any>
}

export const ActionButton = ({
  onConfirm,
  confirmProps = null,
  isShow = true,
  label,
  icon,
}: ActionButtonProps) => {
  const show = typeof isShow === "function" ? isShow() : isShow
  const [confirming, setConfirming] = useState(false)
  const refresh = useRefresh()

  const handleCancel = useCallback(() => setConfirming(false), [setConfirming])

  const handleConfirm = useCallback(async () => {
    if (!onConfirm) {
      return
    }
    const result = await onConfirm()
    setConfirming(false)
    refresh()
    return result
  }, [onConfirm, setConfirming, refresh])

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
