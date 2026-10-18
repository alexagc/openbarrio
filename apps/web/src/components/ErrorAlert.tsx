import React from 'react';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { ProblemDetails } from '@openbarrio/core';

interface ErrorAlertProps {
  message: string;
  problem?: ProblemDetails;
  onRetry?: () => void;
  onSelectSample?: () => void;
}

export function ErrorAlert({ message, problem, onRetry, onSelectSample }: ErrorAlertProps) {
  const title = problem?.title || 'No se pudo completar la auditoría';
  const detail = problem?.detail || message;
  const status = problem?.status;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 shadow-sm max-w-4xl mx-auto space-y-3">
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-rose-950">{title}</h3>
            {status && (
              <span className="text-xs bg-rose-200/80 text-rose-900 font-mono px-2 py-0.5 rounded">
                HTTP {status}
              </span>
            )}
          </div>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">{detail}</p>

          {problem?.invalidParams && problem.invalidParams.length > 0 && (
            <div className="mt-2 text-xs bg-rose-100/60 p-2.5 rounded-lg border border-rose-200">
              <span className="font-semibold block mb-1">Parámetros no válidos:</span>
              <ul className="list-disc list-inside space-y-0.5">
                {problem.invalidParams.map((p, idx) => (
                  <li key={idx}>
                    <span className="font-mono font-bold">{p.name}</span>: {p.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-2 border-t border-rose-200/70 text-xs">
        {onSelectSample && (
          <button
            type="button"
            onClick={onSelectSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-700" />
            <span>Cargar inmueble de prueba</span>
          </button>
        )}

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        )}
      </div>
    </div>
  );
}
