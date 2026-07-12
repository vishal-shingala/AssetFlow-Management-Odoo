/**
 * React Compiler Performance Monitoring & Debugging Utilities
 * Enterprise-grade performance tracking and debugging tools
 */

import React from 'react'

/**
 * Performance monitoring configuration
 */
class ReactCompilerMonitor {
  constructor(config = {}) {
    this.metrics = new Map()
    this.renderCounts = new Map()
    this.startTime = performance.now()
    this.flushTimer = null
    
    this.config = {
      enabled: config.enabled ?? false,
      sampleRate: config.sampleRate ?? 1.0,
      maxMetrics: config.maxMetrics ?? 1000,
      flushInterval: config.flushInterval ?? 30000,
      enableConsoleLogging: config.enableConsoleLogging ?? false,
      enableRemoteReporting: config.enableRemoteReporting ?? false,
      remoteEndpoint: config.remoteEndpoint,
    }

    if (this.config.enabled) {
      this.startFlushTimer()
    }
  }

  /**
   * Track component render
   */
  trackRender(componentName, renderTime) {
    if (!this.config.enabled || Math.random() > this.config.sampleRate) {
      return
    }

    const currentCount = this.renderCounts.get(componentName) || 0
    this.renderCounts.set(componentName, currentCount + 1)

    const existing = this.metrics.get(componentName)
    const metrics = {
      component: componentName,
      renderCount: (existing?.renderCount || 0) + 1,
      renderTime: renderTime,
      memoizationHits: existing?.memoizationHits || 0,
      memoizationMisses: existing?.memoizationMisses || 0,
      optimizationScore: this.calculateOptimizationScore(componentName),
      lastUpdated: new Date(),
    }

    this.metrics.set(componentName, metrics)

    if (this.config.enableConsoleLogging) {
      console.log(`[React Compiler Monitor] ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
    }

    this.enforceMaxMetrics()
  }

  /**
   * Track memoization hit
   */
  trackMemoizationHit(componentName) {
    if (!this.config.enabled) return

    const existing = this.metrics.get(componentName)
    if (existing) {
      existing.memoizationHits++
      existing.optimizationScore = this.calculateOptimizationScore(componentName)
      this.metrics.set(componentName, existing)
    }
  }

  /**
   * Track memoization miss
   */
  trackMemoizationMiss(componentName) {
    if (!this.config.enabled) return

    const existing = this.metrics.get(componentName)
    if (existing) {
      existing.memoizationMisses++
      existing.optimizationScore = this.calculateOptimizationScore(componentName)
      this.metrics.set(componentName, existing)
    }
  }

  /**
   * Get metrics for a specific component
   */
  getMetrics(componentName) {
    return this.metrics.get(componentName)
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    return Array.from(this.metrics.values())
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const allMetrics = this.getAllMetrics()
    const totalRenders = allMetrics.reduce((sum, m) => sum + m.renderCount, 0)
    const averageRenderTime = allMetrics.length > 0
      ? allMetrics.reduce((sum, m) => sum + m.renderTime, 0) / allMetrics.length
      : 0
    const averageMemoizationRate = allMetrics.length > 0
      ? allMetrics.reduce((sum, m) => {
          const total = m.memoizationHits + m.memoizationMisses
          return sum + (total > 0 ? m.memoizationHits / total : 0)
        }, 0) / allMetrics.length
      : 0

    const topRenderedComponents = Array.from(this.renderCounts.entries())
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalComponents: allMetrics.length,
      totalRenders,
      averageRenderTime,
      averageMemoizationRate,
      topRenderedComponents,
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear()
    this.renderCounts.clear()
    this.startTime = performance.now()
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics() {
    return JSON.stringify({
      summary: this.getSummary(),
      metrics: this.getAllMetrics(),
      exportedAt: new Date().toISOString(),
      uptime: performance.now() - this.startTime,
    }, null, 2)
  }

  /**
   * Start automatic flush timer
   */
  startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * Flush metrics to remote endpoint
   */
  async flush() {
    if (!this.config.enableRemoteReporting || !this.config.remoteEndpoint) {
      return
    }

    try {
      const data = this.exportMetrics()
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })
    } catch (error) {
      console.error('[React Compiler Monitor] Failed to flush metrics:', error)
    }
  }

  /**
   * Enforce maximum number of metrics
   */
  enforceMaxMetrics() {
    if (this.metrics.size > this.config.maxMetrics) {
      const entries = Array.from(this.metrics.entries())
      entries.sort((a, b) => a[1].lastUpdated.getTime() - b[1].lastUpdated.getTime())
      
      const toRemove = entries.slice(0, entries.length - this.config.maxMetrics)
      toRemove.forEach(([key]) => this.metrics.delete(key))
    }
  }

  /**
   * Calculate optimization score (0-100)
   */
  calculateOptimizationScore(componentName) {
    const metrics = this.metrics.get(componentName)
    if (!metrics) return 0

    const totalMemoization = metrics.memoizationHits + metrics.memoizationMisses
    if (totalMemoization === 0) return 50

    const memoizationRate = metrics.memoizationHits / totalMemoization
    const renderScore = Math.max(0, 100 - (metrics.renderTime / 10))
    
    return Math.round((memoizationRate * 0.6 + renderScore * 0.4) * 100) / 100
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }
}

/**
 * Global monitor instance
 */
let globalMonitor = null

/**
 * Initialize the global monitor
 */
export function initReactCompilerMonitor(config) {
  if (!globalMonitor) {
    globalMonitor = new ReactCompilerMonitor(config)
  }
  return globalMonitor
}

/**
 * Get the global monitor instance
 */
export function getReactCompilerMonitor() {
  return globalMonitor
}

/**
 * HOC to track component performance
 */
export function withCompilerTracking(componentName, Component) {
  if (!globalMonitor) {
    return Component
  }

  return function TrackedComponent(props) {
    const renderStart = performance.now()
    
    React.useEffect(() => {
      const renderTime = performance.now() - renderStart
      globalMonitor?.trackRender(componentName, renderTime)
    })

    return React.createElement(Component, props)
  }
}

/**
 * Hook to track component renders
 */
export function useCompilerTracking(componentName) {
  if (!globalMonitor) return

  const renderStart = performance.now()

  React.useEffect(() => {
    const renderTime = performance.now() - renderStart
    globalMonitor?.trackRender(componentName, renderTime)
  })
}

/**
 * Debug panel component for development
 */
export function CompilerDebugPanel() {
  if (typeof window === 'undefined' || !globalMonitor) {
    return null
  }

  const [summary, setSummary] = React.useState(globalMonitor.getSummary())
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSummary(globalMonitor.getSummary())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 9999,
        }}
      >
        📊 Compiler Stats
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        maxHeight: 600,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        zIndex: 9999,
        overflow: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>React Compiler Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{ padding: '5px 10px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p><strong>Total Components:</strong> {summary.totalComponents}</p>
        <p><strong>Total Renders:</strong> {summary.totalRenders}</p>
        <p><strong>Avg Render Time:</strong> {summary.averageRenderTime.toFixed(2)}ms</p>
        <p><strong>Memoization Rate:</strong> {(summary.averageMemoizationRate * 100).toFixed(1)}%</p>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0' }}>Top Rendered Components</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {summary.topRenderedComponents.map(({ component, count }) => (
            <li key={component}>
              {component}: {count} renders
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => globalMonitor?.clearMetrics()}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Clear Metrics
      </button>
    </div>
  )
}
