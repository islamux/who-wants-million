import { Component } from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center animate-fade-in p-12">
          <p className="text-rose-400 text-xl mb-4">حدث خطأ غير متوقع</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            className="bg-gradient-to-l from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl cursor-pointer"
          >
            إعادة تحميل
          </button>
        </div>
      )
    }
    return this.props.children
  }
}