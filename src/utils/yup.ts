export function reduceYupErrors(yupErr) {
	return yupErr.inner.reduce((acc, e) => {
		return { ...acc, [e.path]: e.message }
	}, {})
}
