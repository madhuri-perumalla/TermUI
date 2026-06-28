// ESM browser stub for Node built-ins / dev-only packages that have no browser
// meaning (os, net, tls, crypto, stream, @termuijs/dev-server, ...). The website
// is type:module, so a .js file is ESM and must use export syntax — a CJS
// module.exports here triggers a Turbopack format warning and fails at runtime.
// Default export is a Proxy so default/namespace member access returns undefined
// instead of throwing. The only consumer that destructures named bindings is
// jsx's dynamic import('@termuijs/dev-server'), and a missing named binding on a
// dynamic-import namespace resolves to undefined, not an error.
export default new Proxy({}, { get: () => undefined })
