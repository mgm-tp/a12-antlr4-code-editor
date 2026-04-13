/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 * You may redistribute and/or modify this file under the terms of the
 * European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 * Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 * under different terms (including support and maintenance services).
 *
 * Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

var Pair = ValidationRuntimeApi.Pair;
var MapBuilder = ValidationRuntime.MapBuilder;
var Feld_t = ValidationRuntime.Feld_t;
var IFormatDefinition = ValidationRuntime.IFormatDefinition;
var FeldFormatEnumType = ValidationRuntime.FeldFormatEnumType;
var FormatDefinitionString = ValidationRuntime.FormatDefinitionString;
var FormatDefinitionJa = ValidationRuntime.FormatDefinitionJa;
var FormatDefinitionJaNein = ValidationRuntime.FormatDefinitionJaNein;
var FormatDefinitionZahl = ValidationRuntime.FormatDefinitionZahl;
var FormatDefinitionDatum = ValidationRuntime.FormatDefinitionDatum;
var FormatDefinitionDatumBereich = ValidationRuntime.FormatDefinitionDatumBereich;
var Jahresinterpretation = ValidationRuntime.Jahresinterpretation;
var FormatDefinitionVordefiniert = ValidationRuntime.FormatDefinitionVordefiniert;
var DatumTeilbekanntArt = ValidationRuntime.DatumTeilbekanntArt;
var MetaFeldUtil = ValidationRuntime.MetaFeldUtil;
var IIdentifier = ValidationRuntimeApi.IIdentifier;
var Regel_t = ValidationRuntime.Regel_t;
var Identifier_t = ValidationRuntime.Identifier_t;
var ReferenzTyp = ValidationRuntime.ReferenzTyp;
var MetaLokalePflichtInfo = ValidationRuntime.MetaLokalePflichtInfo;
var MetaModelImpl = ValidationRuntime.MetaModelImpl;
var IMetaKeysInternal = ValidationRuntime.IMetaKeysInternal;
var Constants = ValidationRuntime.Constants;
var Container_t = ValidationRuntime.Container_t;
var MetaIdentifier = ValidationRuntime.MetaIdentifier;
var MetaDataHelper = ValidationRuntime.MetaDataHelper;
var Model_t = ValidationRuntime.Model_t;
var HashSet = ValidationRuntimeApi.HashSet;
var TrieNode = ValidationRuntime.TrieNode;var RuntimeController = ValidationRuntime.RuntimeController;
var ArraySet = ValidationRuntimeApi.ArraySet;
var RuleType = ValidationRuntimeApi.RuleType;
var IResult = ValidationRuntimeApi.IResult;
var ErrorType = ValidationRuntimeApi.ErrorType;
var RuntimeFormalErrorEnum = ValidationRuntimeApiPublic.RuntimeFormalErrorEnum;
var MainValidatorController = ValidationRuntime.MainValidatorController;
var PruefErgebnisTyp = ValidationRuntime.PruefErgebnisTyp;
var RtIdentifierTemplate = ValidationRuntime.RtIdentifierTemplate;
var RtInternalIdentifier = ValidationRuntime.RtInternalIdentifier;
var EbenenIterator = ValidationRuntime.EbenenIterator;
var FilterPredicate = ValidationRuntime.FilterPredicate;
var ArrayUtils = ValidationRuntime.ArrayUtils;
var BedingungsOperatorHelper = ValidationRuntime.BedingungsOperatorHelper;
var VglOp = ValidationRuntime.VglOp;
var IFormaleFehlerConstants = ValidationRuntime.IFormaleFehlerConstants;
var ListBuilder = ValidationRuntime.ListBuilder;
var VkString = ValidationRuntime.VkString;
var RepetitionNotUniqueErrorCache = ValidationRuntime.RepetitionNotUniqueErrorCache;
var ValidationCommand = ValidationRuntime.ValidationCommand;
var CalculationCommand = ValidationRuntime.CalculationCommand;
var IterationState = ValidationRuntime.IterationState;
var ValidatorException = ValidationRuntimeApi.ValidatorException;
var CustomConditionException = ValidationRuntimeApi.CustomConditionException;
var Meta_Felder_sample_002epicus = (function () {
	function Meta_Felder_sample_002epicus() {
		this._felder = new Array();
		this._metaFormate = new Map();
		this._mehrsprachigeFehlertexte = new Map();
		this._errorTexts4Req = new Map();
		this._enumerationOberflaechenWerte = new Map();
		this._enumerationCategoryValues = new Map();
		this._stringHintLists = new Map();
		this._initFeldtypen();
		this._initFelder();
	}
	Meta_Felder_sample_002epicus.prototype.getFelder = function () {
		return this._felder;
	};

	Meta_Felder_sample_002epicus.prototype._initFeldtypen = function () {
	this._metaFormate.set(
		0,
		new FormatDefinitionString(
			3, // minLaenge
			50, // maxLaenge
			3, // minLaengePrintable
			50, // maxLaengePrintable
			"", // muster
			this._mehrsprachigeFehlertexte.get(0), // fehlertexte
			false, // zeilenUmbruch
			false, // noValueValidation
			this._stringHintLists.get(0)
		)
	);
	this._metaFormate.set(
		1,
		new FormatDefinitionString(
			-1, // minLaenge
			99999, // maxLaenge
			1, // minLaengePrintable
			99999, // maxLaengePrintable
			"", // muster
			this._mehrsprachigeFehlertexte.get(1), // fehlertexte
			true, // zeilenUmbruch
			false, // noValueValidation
			this._stringHintLists.get(1)
		)
	);
	};

	/*
	 * Die übergebenen Parameter bedeuten (in aufsteigender Reihenfolge):
	 * interne Nummer, eindeutiger name, voller Pfadname, pflichtFeld, mandatoryForRepeatableGroup, Format,
	 * Formatdefinition, javaScriptName, vordruckPflichtfeld (lfd. Nummern), pflichtfeld
	 * (lfd. Nummern), zusätzliche Schlüssel-Werte Paare, berechnungsUebertragServer
	 */
	Meta_Felder_sample_002epicus.prototype._initFelder = function () {
	this._felder.push(
		new Feld_t(
			0,
			"Name",
			"/NormalControls/Name",
			true,
			false,
			this._metaFormate.get(0),
			"sample_002epicusNameValidate",
			[0],
			[0],
			new MapBuilder()
				.put("DruckText", new MapBuilder().put("en", "").put("de", "").build())
				.put("GlobalesFeld", false)
				.put("ExplicitlyMandatory", true)
				.put("TransientField", false)
				.put("IndexField", false).build(),
			new Set(),
			false,
			this._errorTexts4Req.get(0)
		)
	);
	this._felder.push(
		new Feld_t(
			1,
			"Description",
			"/NormalControls/Description",
			true,
			false,
			this._metaFormate.get(0),
			"sample_002epicusDescriptionValidate",
			[0],
			[0],
			new MapBuilder()
				.put("DruckText", new MapBuilder().put("en", "").put("de", "").build())
				.put("GlobalesFeld", false)
				.put("ExplicitlyMandatory", true)
				.put("TransientField", false)
				.put("IndexField", false).build(),
			new Set(),
			false,
			this._errorTexts4Req.get(1)
		)
	);
	this._felder.push(
		new Feld_t(
			2,
			"CodeEditor",
			"/ControlWithCodeEditor/CodeEditor",
			false,
			false,
			this._metaFormate.get(1),
			"sample_002epicusCodeEditorValidate",
			[],
			[],
			new MapBuilder()
				.put("DruckText", new MapBuilder().put("en", "").put("de", "").build())
				.put("GlobalesFeld", false)
				.put("ExplicitlyMandatory", false)
				.put("TransientField", false)
				.put("IndexField", false).build(),
			new Set(),
			false,
			this._errorTexts4Req.get(2)
		)
	);
	};


	return Meta_Felder_sample_002epicus;
}());
var Meta_Regel_sample_002epicus = (function () {
	function Meta_Regel_sample_002epicus() {
		var _this = this;
		this._regeln = new Array();
		// speichert pro Regel die referenzierten Identifier
		this._refIdentifier = new Array(Meta_Regel_sample_002epicus.ANZAHL_REGELN);
		// speichert pro Regel die referenzierten Identifier, die Auslassungsfehler erzeugen können
		this._refAuslassungsIdentifier = new Array(Meta_Regel_sample_002epicus.ANZAHL_REGELN);
		// speichert pro Regel die Vordrucke, die einen Auslassungsfehler erzeugen können
		this._refAuslassungsVordrucke = new Array(Meta_Regel_sample_002epicus.ANZAHL_REGELN);
		this._mehrsprachigeFehlertexte = new Map();
		this._fehlertexteParameterMapping = new Map();
		this._constructor = (function () {
			for (var i = 0; i < Meta_Regel_sample_002epicus.ANZAHL_REGELN; i++) {
				_this._mehrsprachigeFehlertexte.set(i, new Map());
			}
		})();
		this._initRegelRefs();
		this._initRegelFehlertexte();
		this._initRegeln();
	}
	Meta_Regel_sample_002epicus.prototype.getRegeln = function () {
		return this._regeln;
	};
	Meta_Regel_sample_002epicus.ANZAHL_REGELN = 4;

	Meta_Regel_sample_002epicus.prototype._initRegelRefs = function () {
	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorRule'
	this._refIdentifier[0] = [
			new Identifier_t(2, [1, 1], ReferenzTyp.KEINE_BERECHNUNG, null, null)];


	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorAdditionRule'
	this._refIdentifier[1] = [
			new Identifier_t(2, [1, 1], ReferenzTyp.KEINE_BERECHNUNG, null, null)];


	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorAdditionRule_Error'
	this._refIdentifier[2] = [
			new Identifier_t(2, [1, 1], ReferenzTyp.KEINE_BERECHNUNG, null, null)];


	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorRule_Pending_Validation'
	this._refIdentifier[3] = [
			new Identifier_t(2, [1, 1], ReferenzTyp.KEINE_BERECHNUNG, null, null)];


	};

	Meta_Regel_sample_002epicus.prototype._initRegelFehlertexte = function () {
	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorRule'
	this._mehrsprachigeFehlertexte.get(0).set("de", "Ungültiger Code");this._mehrsprachigeFehlertexte.get(0).set("en", "Invalid code");
	this._fehlertexteParameterMapping.set(0, new MapBuilder().build());
	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorAdditionRule'
	this._mehrsprachigeFehlertexte.get(1).set("de", "Zusätzliche Warnmeldung zur Regelbedingung");this._mehrsprachigeFehlertexte.get(1).set("en", "Additional rule condition warning message");
	this._fehlertexteParameterMapping.set(1, new MapBuilder().build());
	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorAdditionRule_Error'
	this._mehrsprachigeFehlertexte.get(2).set("de", "Zusätzliche Regelbedingungsfehlermeldung");this._mehrsprachigeFehlertexte.get(2).set("en", "Additional rule condition error message");
	this._fehlertexteParameterMapping.set(2, new MapBuilder().build());
	// Init Daten zur Regel '/ControlWithCodeEditor/CodeEditorRule_Pending_Validation'
	this._mehrsprachigeFehlertexte.get(3).set("de", "Ausstehender Validierungsjob. Warten Sie mal!");this._mehrsprachigeFehlertexte.get(3).set("en", "Pending validation job. Please wait!");
	this._fehlertexteParameterMapping.set(3, new MapBuilder().build());
	};

	/*
	 * Die übergebenen Parameter:
	 * name, voller pfad, nummer, fehlercode, fehlertexte, regelArt, refIdentifier,
	 * refAuslassungsIdentifier, refAuslassungsVordrucke, fehlerFeld, serverBerechnungsRegel
	 */
	Meta_Regel_sample_002epicus.prototype._initRegeln = function () {
	this._regeln.push(new Regel_t("CodeEditorRule", "/ControlWithCodeEditor/CodeEditorRule", "Error rule_bba8e", this._mehrsprachigeFehlertexte.get(0), this._fehlertexteParameterMapping.get(0), "Fehler", this._refIdentifier[0], null, null, "/ControlWithCodeEditor/CodeEditor", false, false, new MapBuilder().build(), new Set()));

	this._regeln.push(new Regel_t("CodeEditorAdditionRule", "/ControlWithCodeEditor/CodeEditorAdditionRule", "Error rule_157e6", this._mehrsprachigeFehlertexte.get(1), this._fehlertexteParameterMapping.get(1), "Hinweis", this._refIdentifier[1], null, null, "/ControlWithCodeEditor/CodeEditor", false, false, new MapBuilder().build(), new Set()));

	this._regeln.push(new Regel_t("CodeEditorAdditionRule_Error", "/ControlWithCodeEditor/CodeEditorAdditionRule_Error", "Error rule_157e6", this._mehrsprachigeFehlertexte.get(2), this._fehlertexteParameterMapping.get(2), "Fehler", this._refIdentifier[2], null, null, "/ControlWithCodeEditor/CodeEditor", false, false, new MapBuilder().build(), new Set()));

	this._regeln.push(new Regel_t("CodeEditorRule_Pending_Validation", "/ControlWithCodeEditor/CodeEditorRule_Pending_Validation", "Error rule_bba8e", this._mehrsprachigeFehlertexte.get(3), this._fehlertexteParameterMapping.get(3), "Hinweis", this._refIdentifier[3], null, null, "/ControlWithCodeEditor/CodeEditor", false, false, new MapBuilder().build(), new Set()));

	};

	return Meta_Regel_sample_002epicus;
}());
var Meta_PfFeld_sample_002epicus = (function () {
	function Meta_PfFeld_sample_002epicus(metaDataValidierung) {
		this._metaDataValidierung = metaDataValidierung;
	}
	Meta_PfFeld_sample_002epicus.prototype.addLokalePflichtFeldInfos = function (additivUndPflichtfelder) {
		var _this = this;
		var infos = [];
		infos.forEach(function (info) {
			_this._addLokalePflichtFeldInfo(additivUndPflichtfelder, getMetaFSMenge(info[0]), getMetaFSMenge(info[1]));
		});
	};


	Meta_PfFeld_sample_002epicus.prototype._addLokalePflichtFeldInfo = function (additivUndPflichtfelder, additiv, pflichtfelder) {
		var info = MetaLokalePflichtInfo.createLokalePflichtFeldInfo(this._metaDataValidierung, additiv, pflichtfelder);
		additivUndPflichtfelder.push(info);
	};
	return Meta_PfFeld_sample_002epicus;
}());
var getMetaFSMenge = function (beschreibung) {
		var result = new HashSet();
		var felder = beschreibung.split(";");
		for (var i = 0; i < felder.length; i++) {
			if (felder[i].length > 0) {
				result.add(MetaIdentifier.parse(felder[i]));
			}
		}
		return result;
};

var Meta_sample_002epicus = (function () {
	function Meta_sample_002epicus() {
		this._metaFelder = new Meta_Felder_sample_002epicus();
		this._metaRegeln = new Meta_Regel_sample_002epicus();
		this._unterstuetzteSprachen = ["en", "de"];
		this._da = new Model_t(
				"28.4.0", // Produkt-Version
				".", // dezimaltrenner
				["en", "de"], // unterstuetzte Sprachen
				MetaDataHelper.createSetOfStrings("CodeEditorCondition", "CodeEditorPendingValidation", "ProjectConditionError", "ProjectConditionWarning"), //  Namen der Applikationsbedingungen
				MetaDataHelper.createSetOfStrings(), // Names of custom field types
				// additional Values
				new MapBuilder()
					.put("BaseYear", null)
					.put("TimeZone", "UTC")
					.put("ModelId", "sample.picus").build(),
				new Set(["TimeZone", "BaseYear", "ModelId"])
			);
		if (Meta_sample_002epicus._instance) {
			throw new Error("Error: Instantiation failed: Use Meta_sample_002epicus.getInstance() instead of new.");
		}
		Meta_sample_002epicus._instance = this;
		var container = Meta_sample_002epicus._initContainer();
		this._meta = new MetaModelImpl(
			this._da,
			this._metaFelder.getFelder(),
			this._metaRegeln.getRegeln(),
			container,
			Meta_sample_002epicus.LEGAL_CHARACTERS,
			Meta_sample_002epicus.LEGAL_GRAPHEME_TRIE,
			() => E_sample_002epicus.getInstance()
        );
		var metaPlfFeldInfo = new Meta_PfFeld_sample_002epicus(this._meta.getMetaDataValidierung());
		metaPlfFeldInfo
			.addLokalePflichtFeldInfos(this._meta.getValue(IMetaKeysInternal.MODEL_ADDITIV_PFLICHTFELD));
	}
	Object.defineProperty(Meta_sample_002epicus, "RUNTIME_VERSION", { get: function () { return "30.8"; },
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Meta_sample_002epicus, "LEGAL_CHARACTERS_START", {
		get: function () {
			return undefined;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Meta_sample_002epicus, "LEGAL_CHARACTERS_END", {
		get: function () {
			return undefined;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Meta_sample_002epicus, "LEGAL_CHARACTERS", {
		get: function () {
			return undefined;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Meta_sample_002epicus, "LEGAL_GRAPHEME_TRIE", {
    		get: function () {
    			return new TrieNode(new Map(), false);
    		},
    		enumerable: true,
    		configurable: true
    	});

	Meta_sample_002epicus.getInstance = function () {
		return Meta_sample_002epicus._instance;
	};
	Meta_sample_002epicus.prototype.getValue = function (key) {
		var params = [];
		for (var _i = 1; _i < arguments.length; _i++) {
			params[_i - 1] = arguments[_i];
		}

		return this._meta.getValue.apply(this._meta, [key].concat(params));
	};
	Meta_sample_002epicus.prototype.getValidKeys = function () {
		return this._meta.getValidKeys();
	};
	Meta_sample_002epicus._initContainer = function () {
		var result = new Array();
		result.push(new Container_t("/NormalControls", 1, [], new MapBuilder().build(), new Set()));

		result.push(new Container_t("/ControlWithCodeEditor", 1, [], new MapBuilder().build(), new Set()));


		return result;
	};
	Meta_sample_002epicus.prototype.getMetaDataValidierung = function () {
		return this._meta.getMetaDataValidierung();
	};

	Meta_sample_002epicus.prototype.isSpracheUnterstuetzt = function (sprache) {
		return this._unterstuetzteSprachen.indexOf(sprache) !== -1;
	};

	Meta_sample_002epicus._constructor = (function () {
		if (Meta_sample_002epicus.RUNTIME_VERSION !== Constants.RUNTIME_VERSION) {
			throw new Error("The version of the generated code [" + Meta_sample_002epicus.RUNTIME_VERSION + "] does not match the version of the used runtime [" + Constants.RUNTIME_VERSION + "]!");
		}
		Meta_sample_002epicus._instance = new Meta_sample_002epicus();
	})();
	return Meta_sample_002epicus;
}());var E_sample_002epicus = (function () {
	function E_sample_002epicus() {
		if (E_sample_002epicus._valueCalcObject) {
			throw new Error("Instantiation failed: Use E_sample_002epicus.getInstance() instead of new.");
		}
		E_sample_002epicus._valueCalcObject = this;
		this._feldData = Meta_sample_002epicus.getInstance();
		this._metaDataValidierung = this._feldData.getMetaDataValidierung();
	}
	E_sample_002epicus.getInstance = function () {
		return this._valueCalcObject;
	};


	E_sample_002epicus.prototype.calcEnumerationValues = function (field, controller) {
		var startMesspunkt = controller.startMesspunkt();
		var result = new Array();
		switch (field.getName()) {
		}
		return result;
	};

	E_sample_002epicus._valueCalcObject = new E_sample_002epicus();
	return E_sample_002epicus;
}());
var C_sample_002epicus = (function () {
	function C_sample_002epicus() {
		if (C_sample_002epicus._checkObject) {
			throw new Error("Instantiation failed: Use C_sample_002epicus.getInstance() instead of new.");
		}
		C_sample_002epicus._checkObject = this;
		this._feldData = Meta_sample_002epicus.getInstance();
		this._metaDataValidierung = this._feldData.getMetaDataValidierung();
	}
	C_sample_002epicus.getInstance = function () {
		return this._checkObject;
	};


	C_sample_002epicus.CALCULATED_FIELD_DEPENDENCIES = new Map();

	C_sample_002epicus.EXPANDED_OPERAND_FIELDS_OF_CALCULATIONS = new Set();

	C_sample_002epicus.CALC_FUNC_NAME_MAP = new Map();

	C_sample_002epicus.CALCULATED_FIELD_FULL_NAMES_IN_ORDER = [];

	C_sample_002epicus.prototype.executeCalculation = function(fullFieldName, controller) {
	    const startMesspunkt = controller.startMesspunkt();
	    const calcFuncName = C_sample_002epicus.CALC_FUNC_NAME_MAP.get(fullFieldName);
	    this[calcFuncName](controller);
	    controller.logMessung(calcFuncName, startMesspunkt);
    };

    C_sample_002epicus.prototype.hasCalculation = function(fullFieldName) {
        return C_sample_002epicus.CALC_FUNC_NAME_MAP.has(fullFieldName);
    };

    C_sample_002epicus.prototype.getDependencyGraph = function() {
        return C_sample_002epicus.CALCULATED_FIELD_DEPENDENCIES;
    };

	C_sample_002epicus.prototype.getExpandedOperandFieldsOfCalculations = function() {
        return C_sample_002epicus.EXPANDED_OPERAND_FIELDS_OF_CALCULATIONS;
    }

    C_sample_002epicus.prototype.getCalculatedFieldFullNamesInOrder = function() {
        return C_sample_002epicus.CALCULATED_FIELD_FULL_NAMES_IN_ORDER;
    }

	C_sample_002epicus._checkObject = new C_sample_002epicus();
	return C_sample_002epicus;
}());
var R_sample_002epicus = (function () {
	function R_sample_002epicus() {
		this._feldData = Meta_sample_002epicus.getInstance();
		this._metaDataValidierung = this._feldData.getMetaDataValidierung();
	}
	R_sample_002epicus.getInstance = function () {
		return R_sample_002epicus._checkObject;
	};
	R_sample_002epicus.prototype.mvk_CodeEditorRule = function (controller, indices) {
		controller.initFuerRegelpruefung("/ControlWithCodeEditor/CodeEditorRule", PruefErgebnisTyp.Fehler);
		var start = [1, 1];
		var ende = [1, 1];

		var iter = new EbenenIterator(start, ende);
		var rtIdCon1 = RtIdentifierTemplate.builder().unqNm("CodeEditor").isField(true).idx(1).idx(1).build();
		var allRtIdCon1 = new ListBuilder().add(rtIdCon1).build();

		try {
			var innerIter = iter.iterator();
			while (innerIter.hasNext()) {
				var idx = innerIter.next();
				if (controller.alleFelderAngegeben(idx, allRtIdCon1).isKnownAndTrue()&&controller.applikationsBedingung("CodeEditorCondition", RtInternalIdentifier.createFromIterationState("CodeEditor", idx)).isKnownAndTrue()) {
						controller.addValidatorMessage("CodeEditor", idx, "Error rule_bba8e");
				}
			}
		}
		catch (e) {
		    if (e instanceof CustomConditionException) {
		        throw e;
		    } else {
			    controller.addValidatorMessage("CodeEditor", iter.get(), "Error rule_bba8e", e);
			}
		}
	};
	R_sample_002epicus.prototype.mvk_CodeEditorAdditionRule = function (controller, indices) {
		controller.initFuerRegelpruefung("/ControlWithCodeEditor/CodeEditorAdditionRule", PruefErgebnisTyp.Hinweis);
		var start = [1, 1];
		var ende = [1, 1];

		var iter = new EbenenIterator(start, ende);
		var rtIdCon1 = RtIdentifierTemplate.builder().unqNm("CodeEditor").isField(true).idx(1).idx(1).build();
		var allRtIdCon1 = new ListBuilder().add(rtIdCon1).build();

		try {
			var innerIter = iter.iterator();
			while (innerIter.hasNext()) {
				var idx = innerIter.next();
				if (controller.alleFelderAngegeben(idx, allRtIdCon1).isKnownAndTrue()&&controller.applikationsBedingung("ProjectConditionWarning", RtInternalIdentifier.createFromIterationState("CodeEditor", idx)).isKnownAndTrue()) {
						controller.addValidatorMessage("CodeEditor", idx, "Error rule_157e6");
				}
			}
		}
		catch (e) {
		    if (e instanceof CustomConditionException) {
		        throw e;
		    } else {
			    controller.addValidatorMessage("CodeEditor", iter.get(), "Error rule_157e6", e);
			}
		}
	};
	R_sample_002epicus.prototype.mvk_CodeEditorAdditionRule_Error = function (controller, indices) {
		controller.initFuerRegelpruefung("/ControlWithCodeEditor/CodeEditorAdditionRule_Error", PruefErgebnisTyp.Fehler);
		var start = [1, 1];
		var ende = [1, 1];

		var iter = new EbenenIterator(start, ende);
		var rtIdCon1 = RtIdentifierTemplate.builder().unqNm("CodeEditor").isField(true).idx(1).idx(1).build();
		var allRtIdCon1 = new ListBuilder().add(rtIdCon1).build();

		try {
			var innerIter = iter.iterator();
			while (innerIter.hasNext()) {
				var idx = innerIter.next();
				if (controller.alleFelderAngegeben(idx, allRtIdCon1).isKnownAndTrue()&&controller.applikationsBedingung("ProjectConditionError", RtInternalIdentifier.createFromIterationState("CodeEditor", idx)).isKnownAndTrue()) {
						controller.addValidatorMessage("CodeEditor", idx, "Error rule_157e6");
				}
			}
		}
		catch (e) {
		    if (e instanceof CustomConditionException) {
		        throw e;
		    } else {
			    controller.addValidatorMessage("CodeEditor", iter.get(), "Error rule_157e6", e);
			}
		}
	};
	R_sample_002epicus.prototype.mvk_CodeEditorRule_Pending_Validation = function (controller, indices) {
		controller.initFuerRegelpruefung("/ControlWithCodeEditor/CodeEditorRule_Pending_Validation", PruefErgebnisTyp.Hinweis);
		var start = [1, 1];
		var ende = [1, 1];

		var iter = new EbenenIterator(start, ende);
		var rtIdCon1 = RtIdentifierTemplate.builder().unqNm("CodeEditor").isField(true).idx(1).idx(1).build();
		var allRtIdCon1 = new ListBuilder().add(rtIdCon1).build();

		try {
			var innerIter = iter.iterator();
			while (innerIter.hasNext()) {
				var idx = innerIter.next();
				if (controller.alleFelderAngegeben(idx, allRtIdCon1).isKnownAndTrue()&&controller.applikationsBedingung("CodeEditorPendingValidation", RtInternalIdentifier.createFromIterationState("CodeEditor", idx)).isKnownAndTrue()) {
						controller.addValidatorMessage("CodeEditor", idx, "Error rule_bba8e");
				}
			}
		}
		catch (e) {
		    if (e instanceof CustomConditionException) {
		        throw e;
		    } else {
			    controller.addValidatorMessage("CodeEditor", iter.get(), "Error rule_bba8e", e);
			}
		}
	};
	R_sample_002epicus.prototype.mvk_vk_vkName_req = function (controller, indices) {
		controller.initFuerRegelpruefung("/NormalControls/vk_vkName_req", PruefErgebnisTyp.Fehler);
		var start = [1, 1];
		var ende = [1, 1];

		var iter = new EbenenIterator(start, ende);
		var rtIdCon1 = RtIdentifierTemplate.builder().unqNm("Name").isField(true).idx(1).idx(1).build();
		var allRtIdCon1 = new ListBuilder().add(rtIdCon1).build();

		try {
			var innerIter = iter.iterator();
			while (innerIter.hasNext()) {
				var idx = innerIter.next();
				if (controller.keinFeldAngegeben(idx, allRtIdCon1).isKnownAndTrue()) {
						controller.preliminaryError("Name", idx, IFormaleFehlerConstants.FEHLER_PFLICHTFELD, RuntimeFormalErrorEnum.PFLICHT_FELD_FEHLER, ErrorType.OMISSION_ERROR);
				}
			}
		}
		catch (e) {
		    if (e instanceof CustomConditionException) {
		        throw e;
		    } else {
			    controller.addValidatorMessage("Name", iter.get(), "mandatoryField", e);
			}
		}
	};
	R_sample_002epicus.prototype.mvk_vk_vkDescription_req = function (controller, indices) {
		controller.initFuerRegelpruefung("/NormalControls/vk_vkDescription_req", PruefErgebnisTyp.Fehler);
		var start = [1, 1];
		var ende = [1, 1];

		var iter = new EbenenIterator(start, ende);
		var rtIdCon1 = RtIdentifierTemplate.builder().unqNm("Description").isField(true).idx(1).idx(1).build();
		var allRtIdCon1 = new ListBuilder().add(rtIdCon1).build();

		try {
			var innerIter = iter.iterator();
			while (innerIter.hasNext()) {
				var idx = innerIter.next();
				if (controller.keinFeldAngegeben(idx, allRtIdCon1).isKnownAndTrue()) {
						controller.preliminaryError("Description", idx, IFormaleFehlerConstants.FEHLER_PFLICHTFELD, RuntimeFormalErrorEnum.PFLICHT_FELD_FEHLER, ErrorType.OMISSION_ERROR);
				}
			}
		}
		catch (e) {
		    if (e instanceof CustomConditionException) {
		        throw e;
		    } else {
			    controller.addValidatorMessage("Description", iter.get(), "mandatoryField", e);
			}
		}
	};


	R_sample_002epicus.vordruckF__global = function (controller) {
	/* Aufruf der Regeln fuer Vordruck global für eine spezifische lfdNr. */
		var indices = [0];
		var startMesspunkt = -1;
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorRule(controller, indices);
		controller.logMessung("mvk_CodeEditorRule", indices[0], startMesspunkt);
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorAdditionRule_Error(controller, indices);
		controller.logMessung("mvk_CodeEditorAdditionRule_Error", indices[0], startMesspunkt);
	};
	R_sample_002epicus.vordruckH__global = function (controller) {
	/* Aufruf der Regeln fuer Vordruck global für eine spezifische lfdNr. */
		var indices = [0];
		var startMesspunkt = -1;
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorAdditionRule(controller, indices);
		controller.logMessung("mvk_CodeEditorAdditionRule", indices[0], startMesspunkt);
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorRule_Pending_Validation(controller, indices);
		controller.logMessung("mvk_CodeEditorRule_Pending_Validation", indices[0], startMesspunkt);
	};
	R_sample_002epicus.vordruck__global = function (controller) {
	/* Aufruf der Regeln fuer Vordruck global für eine spezifische lfdNr. */
		var indices = [0];
		var startMesspunkt = -1;
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorRule(controller, indices);
		controller.logMessung("mvk_CodeEditorRule", indices[0], startMesspunkt);
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorAdditionRule_Error(controller, indices);
		controller.logMessung("mvk_CodeEditorAdditionRule_Error", indices[0], startMesspunkt);
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorAdditionRule(controller, indices);
		controller.logMessung("mvk_CodeEditorAdditionRule", indices[0], startMesspunkt);
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_CodeEditorRule_Pending_Validation(controller, indices);
		controller.logMessung("mvk_CodeEditorRule_Pending_Validation", indices[0], startMesspunkt);
	};
	R_sample_002epicus.vordruckP__global = function (controller) {
	/* Aufruf der Regeln fuer Vordruck global für eine spezifische lfdNr. */
		var indices = [0];
		var startMesspunkt = -1;
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_vk_vkName_req(controller, indices);
		controller.logMessung("mvk_vk_vkName_req", indices[0], startMesspunkt);
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_vk_vkDescription_req(controller, indices);
		controller.logMessung("mvk_vk_vkDescription_req", indices[0], startMesspunkt);
	};


	R_sample_002epicus.validatePreliminaryRulesForField__Description = function (controller) {
		var indices = [0];
		var startMesspunkt = -1;
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_vk_vkDescription_req(controller, indices);
		controller.logMessung("mvk_vk_vkDescription_req", indices[0], startMesspunkt);
	};
	R_sample_002epicus.validatePreliminaryRulesForField__Name = function (controller) {
		var indices = [0];
		var startMesspunkt = -1;
		startMesspunkt = controller.startMesspunkt();
		this._checkObject.mvk_vk_vkName_req(controller, indices);
		controller.logMessung("mvk_vk_vkName_req", indices[0], startMesspunkt);
	};

	R_sample_002epicus.prototype.validatePreliminaryRulesForField = function(controller, uniqueFieldName) {
		const validationFunc = R_sample_002epicus["validatePreliminaryRulesForField__" + uniqueFieldName];
		if (validationFunc != undefined) {
			validationFunc.call(R_sample_002epicus, controller);
		}
	};

	R_sample_002epicus.prototype.validatePreliminaryRules = function(controller) {
		R_sample_002epicus.vordruckP__global(controller);
};

	R_sample_002epicus.prototype.validiereVoll = function (controller, modus) {
		switch (modus.getRuleType()) {
			case RuleType.ALL:
				this.alleRegeln(controller);
				break;
			case RuleType.INFO:
                this.alleInfoRegeln(controller);
                break;
            case RuleType.HINT:
				this.alleHinweisRegeln(controller);
				break;
			case RuleType.ERROR:
				this.alleFehlerRegeln(controller);
				break;
			default:
				throw new Error("Regelart " + modus.getRuleType() + " wird nicht unterstützt.");
		}
	};
	R_sample_002epicus.prototype.validiereTeil = function (controller, modus, pruefungsFelderMap) {
		var _this = this;
		var checker;
		switch (modus.getRuleType()) {
			case RuleType.ALL:
				checker = new TVCheckAlle_sample_002epicus();
				break;
			case RuleType.INFO:
                checker = new TVCheckInfo_sample_002epicus();
                break;
            case RuleType.HINT:
				checker = new TVCheckHinweis_sample_002epicus();
				break;
			case RuleType.ERROR:
				checker = new TVCheckFehler_sample_002epicus();
				break;
			default:
				throw new Error("Regelart " + modus.getRuleType() + " wird nicht unterstützt.");
		}
		var felder = Array.from(pruefungsFelderMap.values());
		if (controller.getValidationCache().isValidationPartWith3ValueLogic()) {
			var preChecker = new TVCheckPreliminary_sample_002epicus();
			felder.forEach(function (id) {
				var interneFeldNr = _this._metaDataValidierung.getInterneFeldNr(id.getName());
				preChecker.fuehreAus(controller, interneFeldNr, id.getIndices());
			});
		}
		felder.forEach(function (id) {
			var interneFeldNr = _this._metaDataValidierung.getInterneFeldNr(id.getName());
			checker.fuehreAus(controller, interneFeldNr, id.getIndices());
		});
	};
	R_sample_002epicus.prototype.alleRegeln = function (controller) {
		// Aufruf aller Regeln
		R_sample_002epicus.vordruck__global(controller);
};
	R_sample_002epicus.prototype.alleFehlerRegeln = function (controller) {
		// Aufruf aller Fehler-Regeln
		R_sample_002epicus.vordruckF__global(controller);
};
	R_sample_002epicus.prototype.alleHinweisRegeln = function (controller) {
		// Aufruf aller Hinweis-Regeln
		R_sample_002epicus.vordruckH__global(controller);
};
	R_sample_002epicus.prototype.alleInfoRegeln = function (controller) {
        // Aufruf aller Info-Regeln
};
	R_sample_002epicus._checkObject = new R_sample_002epicus();
	return R_sample_002epicus;
}());
/**
 * Diese Klasse dient der Ausführung von Teilvalidierungen von Fehlern.
 *
 */
var TVCheckFehler_sample_002epicus = (function () {
	function TVCheckFehler_sample_002epicus() {
		this._checkObject = R_sample_002epicus.getInstance();
	}
	TVCheckFehler_sample_002epicus.prototype.fuehreAus = function (controller, interneFeldNr, indices) {
		if (interneFeldNr <= 2) {
			this._fuehreAus_0(controller, interneFeldNr, indices);
		}

	};

	/**
	* Führt die Validierung für alle Regeln aus, deren Aktionsfeld die
	* angegebene interne Feldnummer besitzt wenn diese Nummer im Intervall [2,2]
	* liegt.
	*
	* In der Methode werden allerdings nur interne Nummern von Feldern
	* betrachtet, die Aktionsfelder einer Methode sind. Es müssen somit nicht alle
	* Felder des Intervalls in der Switch-Anweisung berücksichtigt werden.
	*
	* @param controller
	* @param interneFeldNr
	* @param indices
	*/

	TVCheckFehler_sample_002epicus.prototype._fuehreAus_0 = function(controller, interneFeldNr, indices) {
		var startMesspunkt = -1;
		switch (interneFeldNr) {
			case 2:
				startMesspunkt = controller.startMesspunkt();
				this._checkObject.mvk_CodeEditorRule(controller, indices);
				controller.logMessung("mvk_CodeEditorRule", indices[0], startMesspunkt);
				startMesspunkt = controller.startMesspunkt();
				this._checkObject.mvk_CodeEditorAdditionRule_Error(controller, indices);
				controller.logMessung("mvk_CodeEditorAdditionRule_Error", indices[0], startMesspunkt);
				break;
			default:
			if (interneFeldNr <= 2) {
				/* In der Methode werden nur interne Nummern von Feldern
				 * betrachtet, die Aktionsfelder einer Methode sind. Es werden somit nicht alle
				 * Zahlen des Intervalls in der Switch-Anweisung berücksichtigt.
				 */
			} else {
				throw new Error("Die interne Feldnummer " + interneFeldNr + " liegt nicht im Interval [2,2].");
			}
			break;
		}
	};

	return TVCheckFehler_sample_002epicus;
}());
var TVCheckHinweis_sample_002epicus = (function () {
	function TVCheckHinweis_sample_002epicus() {
		this._checkObject = R_sample_002epicus.getInstance();
	}
	TVCheckHinweis_sample_002epicus.prototype.fuehreAus = function (controller, interneFeldNr, indices) {
		if (interneFeldNr <= 2) {
			this._fuehreAus_0(controller, interneFeldNr, indices);
		}

	};
	/**
	* Führt die Validierung für alle Regeln aus, deren Aktionsfeld die
	* angegebene interne Feldnummer besitzt wenn diese Nummer im Intervall [2,2]
	* liegt.
	*
	* In der Methode werden allerdings nur interne Nummern von Feldern
	* betrachtet, die Aktionsfelder einer Methode sind. Es müssen somit nicht alle
	* Felder des Intervalls in der Switch-Anweisung berücksichtigt werden.
	*
	* @param controller
	* @param interneFeldNr
	* @param indices
	*/

	TVCheckHinweis_sample_002epicus.prototype._fuehreAus_0 = function(controller, interneFeldNr, indices) {
		var startMesspunkt = -1;
		switch (interneFeldNr) {
			case 2:
				startMesspunkt = controller.startMesspunkt();
				this._checkObject.mvk_CodeEditorAdditionRule(controller, indices);
				controller.logMessung("mvk_CodeEditorAdditionRule", indices[0], startMesspunkt);
				startMesspunkt = controller.startMesspunkt();
				this._checkObject.mvk_CodeEditorRule_Pending_Validation(controller, indices);
				controller.logMessung("mvk_CodeEditorRule_Pending_Validation", indices[0], startMesspunkt);
				break;
			default:
			if (interneFeldNr <= 2) {
				/* In der Methode werden nur interne Nummern von Feldern
				 * betrachtet, die Aktionsfelder einer Methode sind. Es werden somit nicht alle
				 * Zahlen des Intervalls in der Switch-Anweisung berücksichtigt.
				 */
			} else {
				throw new Error("Die interne Feldnummer " + interneFeldNr + " liegt nicht im Interval [2,2].");
			}
			break;
		}
	};
	return TVCheckHinweis_sample_002epicus;
}());
var TVCheckInfo_sample_002epicus = (function () {
	function TVCheckInfo_sample_002epicus() {
		this._checkObject = R_sample_002epicus.getInstance();
	}
	TVCheckInfo_sample_002epicus.prototype.fuehreAus = function (controller, interneFeldNr, indices) {
			// The model does not contain any rules of severity 'INFO'.
	};
	return TVCheckInfo_sample_002epicus;
}());
/**
 * Diese Klasse dient der Ausführung von Teilvalidierungen von Infos, Hinweisen und Fehlern.
 *
 */
var TVCheckAlle_sample_002epicus = (function () {
	function TVCheckAlle_sample_002epicus() {
		this._tvFehlerChecker = new TVCheckFehler_sample_002epicus();
		this._tvHinweisChecker = new TVCheckHinweis_sample_002epicus();
		this._tvInfoChecker = new TVCheckInfo_sample_002epicus();
	}
	TVCheckAlle_sample_002epicus.prototype.fuehreAus = function (controller, interneFeldNr, indices) {
		this._tvFehlerChecker.fuehreAus(controller, interneFeldNr, indices);
		this._tvHinweisChecker.fuehreAus(controller, interneFeldNr, indices);
		this._tvInfoChecker.fuehreAus(controller, interneFeldNr, indices);
	};
	return TVCheckAlle_sample_002epicus;
}());
var TVCheckPreliminary_sample_002epicus = (function () {
	function TVCheckPreliminary_sample_002epicus() {
		this._checkObject = R_sample_002epicus.getInstance();
	}
	TVCheckPreliminary_sample_002epicus.prototype.fuehreAus = function (controller, interneFeldNr, indices) {
		if (interneFeldNr <= 1) {
			this._fuehreAus_0(controller, interneFeldNr, indices);
		}

	};
	/**
	* Führt die Validierung für alle Regeln aus, deren Aktionsfeld die
	* angegebene interne Feldnummer besitzt wenn diese Nummer im Intervall [0,1]
	* liegt.
	*
	* In der Methode werden allerdings nur interne Nummern von Feldern
	* betrachtet, die Aktionsfelder einer Methode sind. Es müssen somit nicht alle
	* Felder des Intervalls in der Switch-Anweisung berücksichtigt werden.
	*
	* @param controller
	* @param interneFeldNr
	* @param indices
	*/

	TVCheckPreliminary_sample_002epicus.prototype._fuehreAus_0 = function(controller, interneFeldNr, indices) {
		var startMesspunkt = -1;
		switch (interneFeldNr) {
			case 0:
				startMesspunkt = controller.startMesspunkt();
				this._checkObject.mvk_vk_vkName_req(controller, indices);
				controller.logMessung("mvk_vk_vkName_req", indices[0], startMesspunkt);
				break;
			case 1:
				startMesspunkt = controller.startMesspunkt();
				this._checkObject.mvk_vk_vkDescription_req(controller, indices);
				controller.logMessung("mvk_vk_vkDescription_req", indices[0], startMesspunkt);
				break;
			default:
			if (interneFeldNr <= 1) {
				/* In der Methode werden nur interne Nummern von Feldern
				 * betrachtet, die Aktionsfelder einer Methode sind. Es werden somit nicht alle
				 * Zahlen des Intervalls in der Switch-Anweisung berücksichtigt.
				 */
			} else {
				throw new Error("Die interne Feldnummer " + interneFeldNr + " liegt nicht im Interval [0,1].");
			}
			break;
		}
	};
	return TVCheckPreliminary_sample_002epicus;
}());
var ERValidator_sample_002epicus = (function () {
	function ERValidator_sample_002epicus() {
		if (ERValidator_sample_002epicus._instance) {
			throw new Error("Error: Instantiation failed: Use ERValidator_sample_002epicus.getInstance() instead of new.");
		}
		ERValidator_sample_002epicus._instance = this;
	}
	ERValidator_sample_002epicus.getInstance = function () {
		return ERValidator_sample_002epicus._instance;
	};
	ERValidator_sample_002epicus.prototype.pruefeParams = function (daten, ergebnis, logger, modus) {
		if (!daten) {
			throw new Error("Übergebene Daten dürfen nicht null sein");
		}
		if (!logger) {
			throw new Error("Übergebener Logger darf nicht null sein");
		}
		if (!ergebnis) {
			throw new Error("Übergebenes Ergebnis darf nicht null sein");
		}
	};
	ERValidator_sample_002epicus.prototype.validatePartlyWith3ValueLogic = function (daten, relevantEntities, ergebnis, modus, logger) {
        this.pruefeParams(daten, ergebnis, logger, modus);
        var c = new ValidationCommand(R_sample_002epicus.getInstance(), modus, ERValidator_sample_002epicus._metaData, logger);
        c.processPartlyValidation(daten, relevantEntities, ergebnis);
	}
	ERValidator_sample_002epicus.prototype.validateAll = function (daten, ergebnis, modus, logger) {
        this.pruefeParams(daten, ergebnis, logger, modus);
        var c = new ValidationCommand(R_sample_002epicus.getInstance(), modus, ERValidator_sample_002epicus._metaData, logger);
        c.processFullValidation(daten, ergebnis);
	};
	ERValidator_sample_002epicus.prototype.calculateAll = function (daten, modus, ergebnis, logger, externalCalculations, changedFieldInstances, forceCalculationSorting) {
        this.pruefeParams(daten, ergebnis, logger, modus);
        var c = new CalculationCommand(R_sample_002epicus.getInstance(), modus, ERValidator_sample_002epicus._metaData, logger, C_sample_002epicus.getInstance(), externalCalculations, changedFieldInstances, forceCalculationSorting);
        var result = c.processCalc(daten, ergebnis);
        return result;
	};
	ERValidator_sample_002epicus._instance = new ERValidator_sample_002epicus();
	ERValidator_sample_002epicus._metaData = Meta_sample_002epicus.getInstance().getMetaDataValidierung();
	// typescript has no static initializer, so this is used
	ERValidator_sample_002epicus._constructor = (function () {
	})();
	return ERValidator_sample_002epicus;
}());

return {
	validator: ERValidator_sample_002epicus,
	meta: Meta_sample_002epicus
};
