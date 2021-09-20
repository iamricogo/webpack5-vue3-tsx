;(async () => {
  const { LoaderUI } = await import('@/loader/ui')
  new LoaderUI().load()
  import('@/main.async')
})()
