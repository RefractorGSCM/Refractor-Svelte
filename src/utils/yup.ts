// @ts-nocheck
import * as yup from "yup"

export function reduceYupErrors(yupErr) {
	return yupErr.inner.reduce((acc, e) => {
		return { ...acc, [e.path]: e.message }
	}, {})
}

function ipv4(message = "Invalid IP address") {
	return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
		message,
		excludeEmptyString: true,
	}).test("ip", message, (value) => {
		return value === undefined || value.trim() === ""
			? true
			: value.split(".").find((i) => parseInt(i, 10) > 255) === undefined
	})
}

yup.addMethod(yup.string, "ipv4", ipv4)
