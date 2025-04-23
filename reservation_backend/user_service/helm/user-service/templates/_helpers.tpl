{{/*
Return the fully qualified app name
*/}}
{{- define "user-service.fullname" -}}
{{ .Release.Name }}-user-service
{{- end }}

{{/*
Common labels
*/}}
{{- define "user-service.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "user-service.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
{{- end }}

{{/*
Service account name
*/}}
{{- define "user-service.serviceAccountName" -}}
{{- if .Values.serviceAccount.name }}
{{ .Values.serviceAccount.name }}
{{- else }}
{{ include "user-service.fullname" . }}
{{- end }}
{{- end }}
